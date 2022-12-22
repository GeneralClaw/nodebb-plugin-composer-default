'use strict';

define('composer/preview', ['hooks'], function (hooks) {
	var preview = {};

	preview.render = function (postContainer, callback) {
		callback = callback || function () {};
		if (!postContainer.find('.preview-container').is(':visible')) {
			return callback();
		}

		var textarea = postContainer.find('textarea');

		socket.emit('plugins.composer.renderPreview', textarea.val(), function (err, preview) {
			if (err) {
				return;
			}
			preview = $('<div>' + preview + '</div>');
			preview.find('img:not(.not-responsive)').addClass('img-fluid');
			postContainer.find('.preview').html(preview);
			hooks.fire('action:composer.preview');
			callback();
		});
	};

	preview.matchScroll = function (postContainer) {
		if (!postContainer.find('.preview-container').is(':visible')) {
			return;
		}
		var textarea = postContainer.find('textarea');
		var preview = postContainer.find('.preview');

		if (textarea.length && preview.length) {
			var diff = textarea[0].scrollHeight - textarea.height();

			if (diff === 0) {
				return;
			}

			var scrollPercent = textarea.scrollTop() / diff;

			preview.scrollTop(Math.max(preview[0].scrollHeight - preview.height(), 0) * scrollPercent);
		}
	};

	preview.handleToggler = function ($postContainer) {
		const postContainer = $postContainer.get(0);

		const isMobile = ['xs', 'sm'].includes(utils.findBootstrapEnvironment());
		const toggler = postContainer.querySelector('.formatting-bar [data-action="preview"]');
		let show = localStorage.getItem('composer:previewToggled') || (preview.env === 'xs' || preview.env === 'sm');
		const previewContainer = postContainer.querySelector('.preview-container');
		const writeContainer = postContainer.querySelector('.write-container');

		if (!toggler) {
			return;
		}

		function togglePreview(show) {
			if (isMobile) {
				previewContainer.classList.toggle('hide', false);
				writeContainer.classList.toggle('maximized', false);
				previewContainer.classList.toggle('d-none', !show);
				previewContainer.classList.toggle('d-flex', show);
				writeContainer.classList.toggle('d-flex', !show);
				writeContainer.classList.toggle('d-none', show);

				// Render preview once on mobile
				if (show) {
					preview.render($postContainer);
				}
			} else {
				previewContainer.classList.toggle('hide', !show);
				writeContainer.classList.toggle('w-50', show);
				writeContainer.classList.toggle('w-100', !show);

				localStorage[show ? 'removeItem' : 'setItem']('composer:previewToggled', true);
			}

			preview.matchScroll($postContainer);
		}
		preview.toggle = togglePreview;

		toggler.addEventListener('click', (e) => {
			if (e.button !== 0) {
				return;
			}

			show = !show;
			togglePreview(show);
		});

		togglePreview(show);
	};

	return preview;
});
