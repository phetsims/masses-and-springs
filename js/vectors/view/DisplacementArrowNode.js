// Copyright 2017-2019, University of Colorado Boulder

/**
 * Vector representation of displacement (y).
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Line = require( 'SCENERY/nodes/Line' );
  const LineArrowNode = require( 'SCENERY_PHET/LineArrowNode' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );

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
      unitDisplacementLength: -100 // use this value to adjust the scale of the vector's length
    }, options );

    const DISPLACEMENT_ARROW_OPTIONS = {
      stroke: new Color( 0, 180, 0 ),
      headWidth: 20,
      headHeight: 10,
      tailLineWidth: 3,
      headLineWidth: 3
    };

    // Creation of the symbol for the displacement vector.
    const displacementArrow = new LineArrowNode( 0, 0, 30, 0, DISPLACEMENT_ARROW_OPTIONS );
    options.children = [ displacementArrow ];

    if ( !options.symbolRepresentation ) {

      assert && assert( options.modelViewTransform !== null, ' options.modelViewTransform should be defined ' );

      const verticalLine = new Line( -10, 0, 10, 0, {
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

          // Used because springs are offset slightly below dev bounds.
          const ceilingOffset = -0.01;
          displacementArrow.setTailAndTip( 0, 0, 0, ceilingOffset * options.modelViewTransform.modelToViewDeltaY( options.unitDisplacementLength * displacement ) );
        }
      } );
      options.children = [ displacementArrow, verticalLine ];
    }
    Node.call( this, options );
  }

  massesAndSprings.register( 'DisplacementArrowNode', DisplacementArrowNode );

  return inherit( Node, DisplacementArrowNode );
} );
