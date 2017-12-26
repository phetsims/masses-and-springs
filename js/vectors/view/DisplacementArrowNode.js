// Copyright 2015, University of Colorado Boulder

/**
 * Vector representation of displacement (x).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<number>} displacementProperty units = m
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function DisplacementArrowNode( displacementProperty, tandem, options ) {

    options = _.extend( {
      verticalLineVisible: true,
      valueVisibleProperty: new Property( true ), // {Property.<boolean>} determines whether the value is visible
      unitDisplacementLength: 100
    }, options );

    var displacementArrow = new ForceVectorArrow( 'green', 'displacementArrow', tandem );

    var verticalLine = new Line( 0, 0, 0, 20, {
      stroke: 'black',
      lineWidth: 2,
      centerY: displacementArrow.centerY,
      visible: options.verticalLineVisible
    } );

    options.children = [ verticalLine, displacementArrow ];

    displacementProperty.link( function( displacement ) {

      // update the vector
      displacementArrow.visible = ( displacement !== 0 ); // since we can't draw a zero-length arrow
      if ( displacement !== 0 ) {
        console.log( 'displacement = ' + displacement );
        displacementArrow.setTailAndTip( 0, 0, options.unitDisplacementLength * displacement, 0 );
      }

    } );
    Node.call( this, options );
  }

  massesAndSprings.register( 'DisplacementArrowNode', DisplacementArrowNode );

  return inherit( Node, DisplacementArrowNode );
} );
