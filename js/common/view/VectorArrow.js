// Copyright 2017-2026, University of Colorado Boulder

/**
 * Responsible for the creation of the arrowNodes associated with the masses and visibility panels.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';

class VectorArrow extends ArrowNode {

  /**
   * @param {Color} color
   */
  constructor( color ) {
    super( 10, 0, 34, 0, {
      fill: color,
      stroke: 'black',
      centerY: 0,
      tailWidth: 8,
      headWidth: 14,
      pickable: false
    } );
  }
}

export default VectorArrow;
