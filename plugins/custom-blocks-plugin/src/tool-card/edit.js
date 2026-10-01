import { TextControl, TextareaControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	return (
		<div { ...useBlockProps( { className: 'terminal-tool-card' } ) }>
			<TextControl
				label={ __( 'Tool name', 'custom-blocks-plugin' ) }
				value={ attributes.title }
				onChange={ ( title ) => setAttributes( { title } ) }
			/>
			<TextareaControl
				label={ __( 'Description', 'custom-blocks-plugin' ) }
				value={ attributes.description }
				onChange={ ( description ) => setAttributes( { description } ) }
			/>
		</div>
	);
}
