// Copyright 2015, University of Colorado Boulder

/**
 * Vector representation of displacement (y).
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LineArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/LineArrowNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Property.<number>} displacementProperty units = m
   * @param {Property.<boolean>} visibleProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function DisplacementArrowNode( displacementProperty, visibleProperty, tandem, options ) {

    options = _.extend( {
      modelViewTransform: null,
      verticalLineVisible: true,
      symbolRepresentation: false,
      unitDisplacementLength: -90 // use this value to adjust the scale of the vector's length
    }, options );

    var DISPLACEMENT_ARROW_OPTIONS = {
      stroke: new Color( 0, 180, 0 ),
      headWidth: 20,
      headHeight: 10,
      headLineWidth: 3,
      tailLineWidth: 3
    };

    // Creation of the symbol for the displacement vector.
    var displacementArrow = new LineArrowNode( 0, 0, 30, 0, DISPLACEMENT_ARROW_OPTIONS );
    options.children = [ displacementArrow ];

    if ( !options.symbolRepresentation ) {

      assert && assert( options.modelViewTransform !== null, ' options.modelViewTransform should be defined ' );

      var verticalLine = new Line( -10, 0, 10, 0, {
        stroke: 'black',
        lineWidth: 2,
        centerY: displacementArrow.centerY,
        visible: options.verticalLineVisible,
        rotate: Math.PI
      } );

      Property.multilink( [ displacementProperty, visibleProperty ], function( displacement, visible ) {

        // update the vector length
        displacementArrow.visible = ( displacement !== 0 ) && visible; // since we can't draw a zero-length arrow
        verticalLine.visible = displacementArrow.visible && visible;
        if ( displacement !== 0 ) {
          displacementArrow.setTailAndTip( 0, 0, 0, -0.01 * options.modelViewTransform.modelToViewY( options.unitDisplacementLength * displacement ) );
        }
      } );
      options.children = [ displacementArrow, verticalLine ];

    }

    Node.call( this, options );
  }

  massesAndSprings.register( 'DisplacementArrowNode', DisplacementArrowNode );

  return inherit( Node, DisplacementArrowNode );
} );
