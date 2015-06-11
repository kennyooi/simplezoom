## Summary

A simple image lightbox jQuery plugin which inspired from Medium website.  
Plugin demo URL: http://www.inwebson.com/demo/simplezoom/demo/


#### How to use

Include the required library and plugin dependency then use jQuery to find the desired lightbox elements on which to call the simplezoom plugin.

````javascript
$('.lightbox').simplezoom();
````

#### CSS requirement

The elements created by plugin itself is naked, mean no styling at all, so that it's easier for personalize customization. If you want a quick fix for that, simply include the ``simplezoom.css`` stylesheet or copy it to your own stylesheet.

#### Options

Name 		| Default 	| Description
-----------	| --------- | ---------------
classie		| '' 		| Extra CSS classes added to created element.
offset 		| 40 		| Minimum spacing between user screen and lightbox image.
scrollclose | true 		| Automatic close the lightbox once user scroll the page.
imgclass 	| 'img' 	| Tell the plugin where to look for the original image. Default to img element.
duration 	| 			| The speed of zoom animation, value in millisecond. Default will use the CSS properties. Not recommended to set this unless you really don’t know how to set it in CSS.
modalTmpl 	| 			| Overwrite the default lightbox HTML. Refer to plugin TEMPLATE variable for guidance.
loaderTmpl 	|			| Overwirte the default ligthbox loader HTML. Refer to plugin LOADER variable for guidance.
onModalInit | 			| Trigger when user click on the image element.
onModalClosed |			| Trigger when user close the lightbox.
onImageLoaded | 		| Trigger when larger version of image successful loaded.
onImageError  |			| Trigger when larger version of image failed to loaded.

#### Code examples

Example of passing settings to plugin.

````javascript
$('.lightbox').simplezoom({
    offset      : 25,
    scrollclose : true
});
````

Example of invoke own function to plugin ``onImageError`` event.

````javascript
$('.lightbox').simplezoom({
 
    /**
     * @image       : default image link element
     * @lightbox    : lightbox element
     */
    onImageError: function(image, lightbox) {
        console.error( 'Oops! Image not found.' );
    }
 
});
````

#### Change Log

**V 1.0.0 - 4th Jun 2015**  
Yes, it is first release.
