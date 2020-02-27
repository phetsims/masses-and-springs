// Copyright 2017-2019, University of Colorado Boulder

/**
 * Shelf used to house the masses when they are not being dragged or attached to a spring
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import massesAndSprings from '../../massesAndSprings.js';

/**
 * @param {Tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function ShelfNode( tandem, options ) {
  options = merge( {
    fill: '#e6c29a',
    stroke: 'black',
    rectHeight: 10,
    rectX: 6,
    rectWidth: 280,
    tandem: tandem
  }, options );
  Rectangle.call( this, options );
}

massesAndSprings.register( 'ShelfNode', ShelfNode );

inherit( Rectangle, ShelfNode );
export default ShelfNode;