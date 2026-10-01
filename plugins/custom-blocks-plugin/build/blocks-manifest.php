<?php
// This file is generated. Do not modify it manually.
return array(
	'custom-blocks' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'custom-blocks/custom-blocks',
		'version' => '0.1.0',
		'title' => 'Custom Blocks',
		'category' => 'widgets',
		'icon' => 'media-interactive',
		'description' => 'An interactive block with the Interactivity API.',
		'example' => array(
			
		),
		'supports' => array(
			'interactivity' => true
		),
		'textdomain' => 'custom-blocks-plugin',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	),
	'tool-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'custom-blocks/tool-card',
		'version' => '0.1.0',
		'title' => 'Tool Card',
		'category' => 'widgets',
		'icon' => 'editor-code',
		'description' => 'An expandable tool and its plain-text description.',
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Tool name'
			),
			'description' => array(
				'type' => 'string',
				'default' => 'Describe this tool.'
			)
		),
		'supports' => array(
			'interactivity' => true
		),
		'textdomain' => 'custom-blocks-plugin',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScriptModule' => 'file:./view.js'
	)
);
