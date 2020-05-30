/**
 * Return not special images from listing.images
 *
 * @param {Object} listing of listing object
 * @param {String} specialImageId 
 *
 * @returns {Array} non special list of images.
 */
export const getNonSpecialImages = (listing, specialImageId) => {
    return listing.images.filter(x => x.id.uuid !== specialImageId);
};

/**
 * Return image from listing.images
 *
 * @param {Object} listing of listing object
 * @param {String} imageId 
 *
 * @returns {Object} image object.
 */
export const getImage = (listing, imageId) => {
    return listing.images.find(x => x.id.uuid === imageId);
};