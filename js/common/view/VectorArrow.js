// Copyright 2017-2020, University of Colorado Boulder

/**
 * Responsible for the creation of the arrowNodes associated with the masses and visibility panels.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import massesAndSprings from '../../massesAndSprings.js';

/**
 * @param {Color} color
 * @constructor
 */
function VectorArrow( color ) {
  ArrowNode.call( this, 10, 0, 34, 0, {
    fill: color,
    stroke: 'black',
    centerY: 0,
    tailWidth: 8,
    headWidth: 14,
    pickable: false
  } );
}

massesAndSprings.register( 'VectorArrow', VectorArrow );

inherit( ArrowNode, VectorArrow );
export default VectorArrow;