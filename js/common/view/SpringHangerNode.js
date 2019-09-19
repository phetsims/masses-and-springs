// Copyright 2017-2019, University of Colorado Boulder

/**
 * Object that creates the grey bar that the springs hang from and their respective numerical label.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // constants
  var SPRING_HANGER_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  var SPRING_HANGER_FILL = 'rgb( 180, 180, 180 )';

  /**
   * @param {Array.<Spring>} springs
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function SpringHangerNode( springs, modelViewTransform, tandem, options ) {

    options = _.extend( {
      singleSpring: false
    }, options );
    if ( options.singleSpring === false ) {
      var springsSeparation =
        modelViewTransform.modelToViewDeltaX( Math.abs( springs[ 0 ].positionProperty.get().x -
                                                        springs[ 1 ].positionProperty.get().x ) );
      var springHangerNodeWidth = springsSeparation * 1.4;

      // X coordinate of middle of springs
      var middleOfSprings = modelViewTransform.modelToViewX( ( springs[ 0 ].positionProperty.get().x +
                                                               springs[ 1 ].positionProperty.get().x ) / 2 );

      // derived from x positions of springs.
      Rectangle.call( this, 0, 0, springHangerNodeWidth, 20, 8, 8, {
        fill: SPRING_HANGER_FILL,
        stroke: 'grey',
        centerX: middleOfSprings,
        top: modelViewTransform.modelToViewY( MassesAndSpringsConstants.CEILING_Y ),
        tandem: tandem.createTandem( 'springHangerNode' )
      } );

      // Node for hanger text label
      var springHangerLabelNode = new Node( { tandem: tandem.createTandem( 'springHangerLabelNode' ) } );
      springHangerLabelNode.addChild( new Text( '1', {
        font: SPRING_HANGER_FONT,
        centerX: springs[ 0 ].positionProperty.get().x - 1.5, // Slightly shifted so tail of the number one is drawn above spring anchor
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
        fill: SPRING_HANGER_FILL,
        stroke: 'grey',
        tandem: tandem
      } );
    }
    this.setCornerRadius( MassesAndSpringsConstants.PANEL_CORNER_RADIUS );
  }

  massesAndSprings.register( 'SpringHangerNode', SpringHangerNode );

  return inherit( Rectangle, SpringHangerNode );
} );