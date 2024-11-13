/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;