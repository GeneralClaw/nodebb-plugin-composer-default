<div component="composer" class="composer pt-2 px-2<!-- IF resizable --> resizable<!-- ENDIF resizable --><!-- IF !isTopicOrMain --> reply<!-- ENDIF !isTopicOrMain -->">

	<div class="composer-container d-flex flex-column h-100">
		<!-- mobile header -->
		<nav class="navbar fixed-top mobile-navbar hidden-md hidden-lg text-bg-primary flex-nowrap">
			<div class="btn-group">
				<button class="btn btn-sm btn-primary composer-discard" data-action="discard" tabindex="-1"><i class="fa fa-times"></i></button>
				<button class="btn btn-sm btn-primary composer-minimize" data-action="minimize" tabindex="-1"><i class="fa fa-minus"></i></button>
			</div>
			<!-- IF isTopic -->
			<div class="category-name-container">
				<span class="category-name"></span> <i class="fa fa-sort"></i>
			</div>
			<!-- ENDIF isTopic -->
			<!-- IF !isTopicOrMain -->
			<h4 class="title text-bg-primary">[[topic:composer.replying_to, "{topicTitle}"]]</h4>
			<!-- ENDIF !isTopicOrMain -->
			<div class="display-scheduler float-end{{{ if !canSchedule }}} hidden{{{ end }}}">
				<i class="fa fa-clock-o"></i>
			</div>
			<div class="btn-group">
				<button class="btn btn-sm btn-primary composer-submit" data-action="post" tabindex="-1"><i class="fa fa-chevron-right"></i></button>
			</div>
		</nav>

		<!-- IMPORT partials/composer-title-container.tpl -->

		<!-- IMPORT partials/composer-formatting.tpl -->

		<!-- IMPORT partials/composer-write-preview.tpl -->

		<!-- IF isTopicOrMain -->
		<!-- IMPORT partials/composer-tags.tpl -->
		<!-- ENDIF isTopicOrMain -->

		<div class="imagedrop"><div>[[topic:composer.drag_and_drop_images]]</div></div>

		<div class="resizer position-absolute w-100 bottom-100 pe-3 border-bottom">
			<div class="trigger text-center">
				<div class="handle d-inline-block px-2 py-1 border bg-body">
					<i class="fa fa-fw fa-up-down"></i>
				</div>
			</div>
		</div>
	</div>
</div>
