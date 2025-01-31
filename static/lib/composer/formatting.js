'use strict';

define('composer/formatting', [
	'composer/preview', 'composer/resize', 'topicThumbs', 'screenfull',
], function (preview, resize, topicThumbs, screenfull) {
	var formatting = {};

	var formattingDispatchTable = {
		picture: function () {
			var postContainer = this;
			postContainer.find('#files').click();
		},

		upload: function () {
			var postContainer = this;
			postContainer.find('#files').click();
		},

		thumbs: function () {
			formatting.exitFullscreen();
			var postContainer = this;
			require(['composer'], function (composer) {
				const uuid = postContainer.get(0).getAttribute('data-uuid');
				const composerObj = composer.posts[uuid];

				if (composerObj.action === 'topics.post' || (composerObj.action === 'posts.edit' && composerObj.isMain)) {
					topicThumbs.modal.open({ id: uuid, pid: composerObj.pid }).then(() => {
						postContainer.trigger('thumb.uploaded');	// toggle draft save

						// Update client-side with count
						composer.updateThumbCount(uuid, postContainer);
					});
				}
			});
		},

		tags: function () {
			var postContainer = this;
			postContainer.find('.tags-container').toggleClass('hidden');
		},

		zen: function () {
			var postContainer = this;
			$(window).one('resize', function () {
				function onResize() {
					if (!screenfull.isFullscreen) {
						app.toggleNavbar(true);
						$('html').removeClass('zen-mode');
						resize.reposition(postContainer);
						$(window).off('resize', onResize);
					}
				}

				if (screenfull.isFullscreen) {
					app.toggleNavbar(false);
					$('html').addClass('zen-mode');
					postContainer.find('.write').focus();

					$(window).on('resize', onResize);
					$(window).one('action:composer.topics.post action:composer.posts.reply action:composer.posts.edit action:composer.discard', screenfull.exit);
				}
			});

			screenfull.toggle(postContainer.get(0));
			$(window).trigger('action:composer.fullscreen', { postContainer: postContainer });
		},
	};

	var buttons = [];

	formatting.exitFullscreen = function () {
		if (screenfull.isEnabled && screenfull.isFullscreen) {
			screenfull.exit();
		}
	};

	formatting.addComposerButtons = function () {
		const formattingBarEl = $('.formatting-bar');
		const fileForm = formattingBarEl.find('.formatting-group #fileForm');
		buttons.forEach((btn) => {
			let markup = ``;
			if (Array.isArray(btn.dropdownItems) && btn.dropdownItems.length) {
				markup = generateFormattingDropdown(btn);
			} else {
				markup = `
					<li data-format="${btn.name}" title="${btn.title || ''}" href="#" class="btn btn-sm btn-link text-reset position-relative" tabindex="-1">
						<i class="${btn.iconClass}"></i>
					</li>
				`;
			}
			fileForm.before(markup);
		});

		const els = formattingBarEl.find('.formatting-group>li');
		els.tooltip({
			container: '#content',
			animation: false,
			trigger: 'manual',
		}).on('mouseenter', function (ev) {
			const target = $(ev.target);
			const isDropdown = target.hasClass('dropdown-menu') || !!target.parents('.dropdown-menu').length;
			if (!isDropdown) {
				$(this).tooltip('show');
			}
		}).on('click mouseleave', function () {
			$(this).tooltip('hide');
		});
	};

	function generateFormattingDropdown(btn) {
		const dropdownItemsHtml = btn.dropdownItems.map(function (btn) {
			let badgeHtml = '';
			if (btn.badge) {
				badgeHtml = `<span class="px-1 position-absolute top-0 start-100 translate-middle-x badge rounded text-bg-info"></span>`;
			}
			return `
				<li data-format="${btn.name}">
					<a href="#" class="dropdown-item rounded-1 position-relative">
						<i class="${btn.iconClass} text-secondary"></i> ${btn.text}
						${badgeHtml}
					</a>
				</li>
			`;
		});
		return `
			<li class="dropdown bottom-sheet" tab-index="-1" title="${btn.title}">
				<button class="btn btn-sm btn-link text-reset" data-bs-toggle="dropdown" >
					<i class="${btn.iconClass}"></i>
				</button>
				<ul class="dropdown-menu p-1">
				${dropdownItemsHtml}
				</ul>
			</li>
		`;
	}

	formatting.addButton = function (iconClass, onClick, title, name) {
		name = name || iconClass.replace('fa fa-', '');
		formattingDispatchTable[name] = onClick;
		buttons.push({
			name,
			iconClass,
			title,
		});
	};

	formatting.addDropdown = function (data) {
		buttons.push({
			iconClass: data.iconClass,
			title: data.title,
			dropdownItems: data.dropdownItems,
		});
		data.dropdownItems.forEach((btn) => {
			if (btn.name && btn.onClick) {
				formattingDispatchTable[btn.name] = btn.onClick;
			}
		});
	};

	formatting.getDispatchTable = function () {
		return formattingDispatchTable;
	};

	formatting.addButtonDispatch = function (name, onClick) {
		formattingDispatchTable[name] = onClick;
	};

	formatting.addHandler = function (postContainer) {
		postContainer.on('click', '.formatting-bar li[data-format]', function (event) {
			var format = $(this).attr('data-format');
			var textarea = $(this).parents('[component="composer"]').find('textarea')[0];

			if (formattingDispatchTable.hasOwnProperty(format)) {
				formattingDispatchTable[format].call(
					postContainer, textarea, textarea.selectionStart, textarea.selectionEnd, event
				);
				preview.render(postContainer);
			}
		});
	};

	return formatting;
});
