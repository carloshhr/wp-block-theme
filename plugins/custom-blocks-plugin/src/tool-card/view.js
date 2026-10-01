import { store, getContext } from '@wordpress/interactivity';

store( 'custom-blocks/tool-card', {
	actions: {
		toggle() {
			const context = getContext();
			context.isOpen = ! context.isOpen;
		},
	},
} );
