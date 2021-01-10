# Pixel Push

This is my submission for Shopify's Summer 2021 Developer Intern Challenge.

## What is Pixel Push

[Pixel Push](https://pixelpush.garethdev.space) is a collaborative photo sharing application. It was designed for users to quickly consildate and download photos from any event.

## Using Pixel Push

Start by creating a new album by inputting the name of the event and the date that it took place. This information will be publicaly visible and can help other's understand what this album is about. Next, upload any images related to the event. Finally, share the URL of the album for others to contribute thier own photos or download photos in the album.

Users can be in three states when using the application (in relationship to an album):

1. Creator - an authenticated user that created the album
2. Contributor - an authenticated user that did not create the album
3. Viewer - an unauthenticated user

**Creators** have full control over the album. They can upload photos and remove photos (including photos uploaded by other contributors). Creators can also delete an album including all the uploaded photos.

**Contributors** have the ability to upload photos to an album and can remove their own uploaded photos from an album. They are unable to remove photos uploaded by other contributors and cannot delete the album.

**Viewers** can only view and download the uploaded photos. Any viewer can log in and contribute to the album if they wish.

## Demo

### Creating an Album and Uploading Images

![](/demo/upload.gif)

### Loading Full Resolution Image

_The increase in quality from the preview to the full resolution image is hard to tell in the gif. In this example, the image preview is around 38 KB and the full resolution image is around 9.5 MB._

![](/demo/load-full-res-image.gif)

### Sharing the Album

![](/demo/share.jpg)

### Permissions

What the creator of the album sees:
![](/demo/creator.jpg)

What contributors or viewers see:
![](/demo/viewer.jpg)
