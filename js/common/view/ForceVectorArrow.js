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
function ForceVectorArrow( color ) {
  ArrowNode.call( this, 5, 0, 31, 0, {
    fill: color,
    stroke: color,
    centerY: 0,
    tailWidth: 3,
    headWidth: 11,
    pickable: false
  } );
}

massesAndSprings.register( 'ForceVectorArrow', ForceVectorArrow );

inherit( ArrowNode, ForceVectorArrow );
export default ForceVectorArrow;