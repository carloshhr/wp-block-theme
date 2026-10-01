<?php
/** Server-rendered expandable tool card. */
$description_id = wp_unique_id( 'tool-description-' );
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => 'terminal-tool-card' ) ); ?>
	data-wp-interactive="custom-blocks/tool-card"
	<?php echo wp_interactivity_data_wp_context( array( 'isOpen' => false ) ); ?>
>
	<button type="button"
		aria-controls="<?php echo esc_attr( $description_id ); ?>"
		aria-expanded="false"
		data-wp-on--click="actions.toggle"
		data-wp-bind--aria-expanded="context.isOpen"
	><?php echo esc_html( $attributes['title'] ?? 'Tool name' ); ?></button>
	<p id="<?php echo esc_attr( $description_id ); ?>"
		hidden
		data-wp-bind--hidden="!context.isOpen"
	><?php echo esc_html( $attributes['description'] ?? 'Describe this tool.' ); ?></p>
</div>
