/**
 * CAGov Promotional Card Grid
 *
 */
 (function (blocks, element, blockEditor, i18n) {
  var __ = i18n.__;
  const el = element.createElement;
  const InnerBlocks = blockEditor.InnerBlocks;
  const ALLOWED_BLOCKS = ['ca-design-system/promotional-card'];
  blocks.registerBlockType('ca-design-system/promotional-card-grid', {
    title: 'Promotional card grid',
    icon: "format-aside",
    category: 'ca-design-system',
    description: __("DESCRIPTION", "ca-design-system"),
    edit: function (props) { 
      return el(
        'div',
        { className: 'cagov-grid cagov-stack cagov-block' },
        el(InnerBlocks,
          {
            orientation: 'horizontal',
            allowedBlocks: ALLOWED_BLOCKS
          }
        )
      );
    },
    save: function (props) {
      return el(
        'div',
        { className: 'cagov-grid cagov-stack cagov-block' },
        el(InnerBlocks.Content)
      );
    }
  });
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.i18n);


/**
 * CAGov promotional card
 *
 * Simple block, renders and saves the same content without interactivity.
 *
 * Using inline styles - no external stylesheet needed.  Not recommended
 * because all of these styles will appear in `post_content`.
 */
(function (blocks, editor, i18n, element, components, _, data) {
  const __ = i18n.__;
  const el = element.createElement;
  const RichText = editor.RichText;
  const MediaUpload = editor.MediaUpload;
  const InnerBlocks = editor.InnerBlocks;

  blocks.registerBlockType("ca-design-system/promotional-card", {
    title: __("Promotional card (individual)", "cagov-design-system"),
    category: "ca-design-system",
    icon: "format-aside",
    description: __("Description", "ca-design-system"),
    supports: {
      reusable: true,
      multiple: true,
      inserter: true,
    },
    attributes: {
      title: {
        type: "string",
      },
      startDate: {
        type: "string",
      },
      endDate: {
        type: "string",
      },
      body: {
        type: 'array',
        source: 'children',
        selector: 'p'
      },
      buttontext: {
        type: 'array',
        source: 'children',
        selector: 'a'
      },
      buttonurl: {
        type: 'array',
        source: 'children',
        selector: 'button'
      },
      mediaID: {
        type: "number",
      },
      previewMediaUrl: {
        type: "string",
      },
    },
    example: {
      attributes: {
        title: __("Campaign title", "cagov-design-system"),
        startDate: __("Start date", "cagov-design-system"),
        endDate: __("End date", "cagov-design-system"),
        body: __("Lorem ipsum", "cagov-design-system"),
        buttontext: __("View toolkit", "cagov-design-system"),
        buttonurl: __("https://example.com", "cagov-design-system"),
        previewMediaUrl: "http://www.fillmurray.com/576/338",
        images: {
          mediaAlt: __("Image Alt", "cagov-design-system"),
          mediaCaption: __("Image Caption", "cagov-design-system"),
          mediaDescription: __("Image Description", "cagov-design-system"),
          mediaTitle: __("Image Title", "cagov-design-system"),
          desktop: {
            mediaURL: "http://www.fillmurray.com/576/338",
            mediaWidth: "576",
            mediaHeight: "338",
          },
          tablet: {
            mediaURL: "http://www.fillmurray.com/576/338",
            mediaWidth: "576",
            mediaHeight: "338",
          },
          mobile: {
            mediaURL: "http://www.fillmurray.com/576/338",
            mediaWidth: "576",
            mediaHeight: "338",
          },
        },
      },
    },
    edit: function (props) {
      const attributes = props.attributes;

      var id = attributes.mediaID;
      var images = attributes.images;
      const { useSelect } = data;

      // Auto update media preview alt & captions;
      var mediaObject = useSelect(
        (select) => {
          return select("core").getMedia(id);
        },
        [id]
      );

      const MediaImageElement = () => {
        // console.log("media", mediaObject);
        if (
          mediaObject !== undefined &&
          mediaObject.media_details.sizes !== undefined
        ) {
          const mediaURL = mediaObject.media_details.sizes.large.source_url;
          const mediaAlt = mediaObject.alt_text;
          // const mediaCaption = mediaObject.caption.raw;
          // const mediaTitle = mediaObject.title.raw;
          // const mediaDescription = mediaObject.description.raw;
          const mediaWidth = mediaObject.media_details.sizes.large.width;
          const mediaHeight = mediaObject.media_details.sizes.large.height;
          return el("img", {
            src: mediaURL,
            className: "cagov-card-image",
            alt: mediaAlt,
            width: mediaWidth,
            height: mediaHeight,
          });
        }
        return null;
      };

      // Trying to get a quicker preview - may be slow image or local cache issue
      var MediaImage = 
      el("img", {
        src: attributes.previewMediaUrl,
        className: "cagov-card-image",
        alt: "Alt placeholder",
        width: 576,
        height: 338,
      });

      MediaImage = MediaImageElement(mediaObject); // async, a little slow

      const onSelectImage = function (media) {
        console.log("med", media);
        // Raw media object, not formatted
        // Store data for local use in preview (of alt tags and responsive image sizes) (may deprecate, but not sure yet)
        return props.setAttributes({
          mediaID: media.id,
          previewMediaUrl: media.sizes.thumbnail.url // Thumbnail
        });
      };

      // removed: cagov-with-sidebar cagov-with-sidebar-left cagov-featured-section cagov-bkgrd-gry
      // @TODO cards need their own pattern conventions, simplifying this so we have the cagov-block & css only namespace

      return el(
        "div",
        { className: "wp-block-ca-design-system-promotional-card cagov-promotional-card cagov-block" },
        el(
          "div",
          { className: "cagov-stack" },
          el(
            "div",
            { className: "cagov-card-image" },
            el(MediaUpload, {
              onSelect: onSelectImage,
              allowedTypes: "image",
              value: attributes.mediaID,
              render: function (obj) {
                return el(
                  components.Button,
                  {
                    className: attributes.mediaID
                      ? "image-button"
                      : "button button-large",
                    onClick: obj.open,
                  },
                  !attributes.mediaID
                    ? __("Upload Image", "cagov-design-system")
                    : MediaImage
                );
              },
            })
          ),
          el(RichText, {
            tagName: "h2",
            inline: true,
            placeholder: __("Write title…", "cagov-design-system"),
            value: attributes.title,
            onChange: function (value) {
              props.setAttributes({ title: value });
            },
          }),
          el(RichText, {
            tagName: "div",
            className: "cagov-card-start-date",
            inline: false,
            placeholder: __("Start date", "cagov-design-system"),
            value: attributes.startDate,
            onChange: function (value) {
              props.setAttributes({ startDate: value });
            },
          }),
          el(RichText, {
            tagName: "div",
            className: "cagov-card-end-date",
            inline: false,
            placeholder: __("End date", "cagov-design-system"),
            value: attributes.endDate,
            onChange: function (value) {
              props.setAttributes({ endDate: value });
            },
          }),
          el(
            "div",
            { className: "cagov-card-body" },
            el(editor.InnerBlocks, {
              allowedBlocks: ["core/paragraph", "core/button"],
              onChange: function (value) {
                console.log(value);
              },
            })
          )
        )
      );
    },
    save: function (props) {
      const attributes = props.attributes;  

      return el('div', {},
            el('div', { className: 'cagov-card-body-content' },
              el(editor.InnerBlocks.Content)
            )
      );

      // return el('div', { className: 'wp-block-ca-design-system-promotional-card cagov-promotional-card cagov-block' },
      //   el('div', {},
      //     el('div', { className: 'cagov-stack cagov-p-2 cagov-featured-sidebar' },
      //       { className: 'cagov-promotional-card cagov-stack' },
      //       el(RichText.Content, {
      //         tagName: 'h2',
      //         value: attributes.title
      //       }),
      //       el('div', { className: 'cagov-promotional-card-body-content' },
      //         el(editor.InnerBlocks.Content)
      //       )
      //     ),
      //     attributes.mediaURL && el('div', { },
      //       el('img', { className: 'cagov-featured-image', src: attributes.mediaURL, alt: attributes.mediaAlt, width: attributes.mediaWidth, height: attributes.mediaHeight }
      //       )
      //     )
      //   )
      // );
    }
  });
})(
  window.wp.blocks,
  window.wp.blockEditor,
  window.wp.i18n,
  window.wp.element,
  window.wp.components,
  window._,
  window.wp.data
);
