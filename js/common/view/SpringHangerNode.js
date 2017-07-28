// Copyright 2016-2017, University of Colorado Boulder

/**
 * Object that creates the grey bar that the springs hang from and their respective numerical label.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // constants
  var SPRING_HANGER_FONT = new PhetFont( { size: 16, weight: 'bold' } );

  // REVIEW: The model is only used for the springs, would be better to just pass in the springs array.
  /**
   * @param {MassesAndSpringsModel} model
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function SpringHangerNode( model, modelViewTransform2, tandem, options ) {
    options = _.extend( {
      singleSpring: false
    }, options );

    if ( options.singleSpring === false ) {
      var springsSeparation =
        modelViewTransform2.modelToViewDeltaX( Math.abs( model.springs[ 0 ].positionProperty.get().x -
                                                         model.springs[ 1 ].positionProperty.get().x ) );
      var springHangerNodeWidth = springsSeparation * 1.4;

      // X coordinate of middle of springs
      var middleOfSprings = modelViewTransform2.modelToViewX( (model.springs[ 0 ].positionProperty.get().x +
                                                               model.springs[ 1 ].positionProperty.get().x) / 2 );

      // derived from x positions of springs.
      Rectangle.call( this, 0, 0, springHangerNodeWidth, 20, 8, 8, {
        fill: 'rgb( 180, 180, 180 )',
        stroke: 'grey',
        centerX: middleOfSprings,
        top: modelViewTransform2.modelToViewY( MassesAndSpringsConstants.CEILING_Y ),
        tandem: tandem.createTandem( 'springHangerNode' )
      } );

      // Node for hanger text label
      var springHangerLabelNode = new Node( { tandem: tandem.createTandem( 'springHangerLabelNode' ) } );
      springHangerLabelNode.addChild( new Text( '1', {
        font: SPRING_HANGER_FONT,
        tandem: tandem.createTandem( '1' )
      } ) );
      springHangerLabelNode.addChild( new Text( '2', {
        font: SPRING_HANGER_FONT,
        tandem: tandem.createTandem( '2' ),
        centerX: springsSeparation
      } ) );
      springHangerLabelNode.centerX = this.width / 2;
      springHangerLabelNode.centerY = this.height / 2;
      this.addChild( springHangerLabelNode );
    }

    else {
      // derived from x positions of springs.
      Rectangle.call( this, 0, 0, 48, 20, 8, 8, {
        fill: 'rgb( 180, 180, 180 )',
        stroke: 'grey',
        tandem: tandem
      } );
    }
  }

  massesAndSprings.register( 'SpringHangerNode', SpringHangerNode );

  return inherit( Rectangle, SpringHangerNode );
} );