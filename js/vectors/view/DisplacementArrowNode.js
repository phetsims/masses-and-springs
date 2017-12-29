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
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<number>} displacementProperty units = m
   * @param {Property.<boolean>} visibleProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function DisplacementArrowNode( mvt, displacementProperty, visibleProperty, tandem, options ) {

    options = _.extend( {
      verticalLineVisible: true,
      unitDisplacementLength: -100
    }, options );

    var displacementArrow = new ForceVectorArrow( 'green', 'displacementArrow', tandem );

    var verticalLine = new Line( -10, 0, 10, 0, {
      stroke: 'black',
      lineWidth: 2,
      centerY: displacementArrow.centerY,
      visible: options.verticalLineVisible,
      rotate: Math.PI
    } );

    options.children = [ verticalLine, displacementArrow ];

    Property.multilink( [ displacementProperty, visibleProperty ], function( displacement, visible ) {

      // update the vector
      displacementArrow.visible = ( displacement !== 0 ) && visible; // since we can't draw a zero-length arrow
      verticalLine.visible = displacementArrow.visible && visible;
      if ( displacement !== 0 ) {
        displacementArrow.setTailAndTip( 0, 0, 0, -0.01 * mvt.modelToViewY( options.unitDisplacementLength * displacement ) );
      }
    } );
    Node.call( this, options );
  }

  massesAndSprings.register( 'DisplacementArrowNode', DisplacementArrowNode );

  return inherit( Node, DisplacementArrowNode );
} );
