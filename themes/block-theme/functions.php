<?php
/** Load the theme stylesheet in both views. */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'block-theme', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
} );
add_action( 'after_setup_theme', function () {
	add_editor_style( 'style.css' );
} );
