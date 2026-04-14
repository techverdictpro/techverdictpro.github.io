<?php
/**
 * Plugin Name: TechWise Pro Auto Publisher
 * Plugin URI: https://techwise-pro.com
 * Description: Автоматично публикуване на AI-генерирани статии от TechWise Pro system
 * Version: 1.0.0
 * Author: TechWise Pro
 * License: GPL2
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class TechWise_Auto_Publisher {
    
    private $api_endpoint;
    private $api_key;
    
    public function __init() {
        // Settings
        $this->api_endpoint = get_option('techwise_api_endpoint', 'https://yoursite.com/api');
        $this->api_key = get_option('techwise_api_key', '');
        
        // Hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('techwise_auto_publish', array($this, 'publish_new_articles'));
        
        // Schedule cron job
        if (!wp_next_scheduled('techwise_auto_publish')) {
            wp_schedule_event(time(), 'hourly', 'techwise_auto_publish');
        }
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'TechWise Pro',
            'TechWise Pro',
            'manage_options',
            'techwise-pro',
            array($this, 'admin_page'),
            'dashicons-welcome-write-blog',
            30
        );
    }
    
    /**
     * Admin settings page
     */
    public function admin_page() {
        if (isset($_POST['techwise_save_settings'])) {
            update_option('techwise_api_endpoint', sanitize_text_field($_POST['api_endpoint']));
            update_option('techwise_api_key', sanitize_text_field($_POST['api_key']));
            update_option('techwise_default_category', intval($_POST['default_category']));
            update_option('techwise_auto_publish', isset($_POST['auto_publish']) ? 1 : 0);
            echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
        }
        
        $api_endpoint = get_option('techwise_api_endpoint', '');
        $api_key = get_option('techwise_api_key', '');
        $default_category = get_option('techwise_default_category', 1);
        $auto_publish = get_option('techwise_auto_publish', 1);
        
        ?>
        <div class="wrap">
            <h1>⚡ TechWise Pro Auto Publisher</h1>
            
            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>📊 Statistics</h2>
                <table class="widefat">
                    <tr>
                        <td><strong>Total Published Articles:</strong></td>
                        <td><?php echo $this->get_published_count(); ?></td>
                    </tr>
                    <tr>
                        <td><strong>Last Publish:</strong></td>
                        <td><?php echo get_option('techwise_last_publish', 'Never'); ?></td>
                    </tr>
                    <tr>
                        <td><strong>Next Scheduled:</strong></td>
                        <td><?php echo date('Y-m-d H:i:s', wp_next_scheduled('techwise_auto_publish')); ?></td>
                    </tr>
                </table>
            </div>
            
            <form method="post" action="" style="max-width: 800px; margin-top: 20px;">
                <div class="card">
                    <h2>⚙️ Settings</h2>
                    
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="api_endpoint">API Endpoint</label></th>
                            <td>
                                <input type="text" id="api_endpoint" name="api_endpoint" 
                                       value="<?php echo esc_attr($api_endpoint); ?>" 
                                       class="regular-text" placeholder="https://yoursite.com/api">
                                <p class="description">URL to your TechWise Pro API</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <th scope="row"><label for="api_key">API Key</label></th>
                            <td>
                                <input type="password" id="api_key" name="api_key" 
                                       value="<?php echo esc_attr($api_key); ?>" 
                                       class="regular-text">
                                <p class="description">Your API authentication key</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <th scope="row"><label for="default_category">Default Category</label></th>
                            <td>
                                <?php
                                wp_dropdown_categories(array(
                                    'name' => 'default_category',
                                    'selected' => $default_category,
                                    'show_option_none' => 'Select Category',
                                    'hide_empty' => 0
                                ));
                                ?>
                                <p class="description">Category for auto-published articles</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <th scope="row"><label for="auto_publish">Auto Publish</label></th>
                            <td>
                                <label>
                                    <input type="checkbox" id="auto_publish" name="auto_publish" 
                                           <?php checked($auto_publish, 1); ?>>
                                    Enable automatic publishing every hour
                                </label>
                            </td>
                        </tr>
                    </table>
                    
                    <p class="submit">
                        <input type="submit" name="techwise_save_settings" 
                               class="button button-primary" value="Save Settings">
                        <a href="?page=techwise-pro&action=publish_now" 
                           class="button">Publish Now (Manual)</a>
                    </p>
                </div>
            </form>
        </div>
        <?php
        
        // Manual publish
        if (isset($_GET['action']) && $_GET['action'] == 'publish_now') {
            $this->publish_new_articles();
            echo '<div class="notice notice-success"><p>Manual publish completed!</p></div>';
        }
    }
    
    /**
     * Fetch and publish new articles
     */
    public function publish_new_articles() {
        $api_endpoint = get_option('techwise_api_endpoint');
        $api_key = get_option('techwise_api_key');
        
        if (empty($api_endpoint) || empty($api_key)) {
            error_log('TechWise Pro: API credentials not configured');
            return;
        }
        
        // Fetch new articles from API
        $response = wp_remote_get($api_endpoint . '/get-new-articles', array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $api_key
            )
        ));
        
        if (is_wp_error($response)) {
            error_log('TechWise Pro: API request failed - ' . $response->get_error_message());
            return;
        }
        
        $articles = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($articles)) {
            error_log('TechWise Pro: No new articles to publish');
            return;
        }
        
        $published_count = 0;
        
        foreach ($articles as $article) {
            // Create post
            $post_id = wp_insert_post(array(
                'post_title'    => $article['title'],
                'post_content'  => $article['content'],
                'post_excerpt'  => $article['meta'],
                'post_status'   => 'publish',
                'post_type'     => 'post',
                'post_category' => array(get_option('techwise_default_category', 1)),
                'meta_input'    => array(
                    '_yoast_wpseo_metadesc' => $article['meta'],
                    '_techwise_keywords' => $article['keywords'],
                    '_techwise_generated' => 1,
                    '_techwise_generated_date' => current_time('mysql')
                )
            ));
            
            if ($post_id) {
                $published_count++;
                
                // Add tags if provided
                if (!empty($article['tags'])) {
                    wp_set_post_tags($post_id, $article['tags'], true);
                }
                
                error_log("TechWise Pro: Published article ID {$post_id} - {$article['title']}");
            }
        }
        
        // Update last publish time
        update_option('techwise_last_publish', current_time('mysql'));
        
        // Update total count
        $total = get_option('techwise_total_published', 0);
        update_option('techwise_total_published', $total + $published_count);
        
        error_log("TechWise Pro: Published {$published_count} new articles");
    }
    
    /**
     * Get published articles count
     */
    private function get_published_count() {
        return get_option('techwise_total_published', 0);
    }
}

// Initialize plugin
function techwise_auto_publisher_init() {
    $plugin = new TechWise_Auto_Publisher();
    $plugin->__init();
}
add_action('plugins_loaded', 'techwise_auto_publisher_init');

// Deactivation hook - clear scheduled events
register_deactivation_hook(__FILE__, function() {
    wp_clear_scheduled_hook('techwise_auto_publish');
});
