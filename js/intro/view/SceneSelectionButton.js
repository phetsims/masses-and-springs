// Copyright 2016-2018, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = 0.3;

  /**
   * @param {Property.<string>} springLengthProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function SceneSelectionButton( springLengthProperty, mvt, tandem ) {

    Node.call( this, {
      scale: IMAGE_SCALE
    } );

    // @public {read-only} Springs created to be used in the icons for the scene selection tabs
    var springsIcon = [
      new Spring(
        new Vector2( 0.65, 2.1 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'firstIconSpring' )
      ),
      new Spring(
        new Vector2( 0.85, 2.1 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'secondIconSpring' )
      ),
      new Spring(
        new Vector2( 0.85, 2.2 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'thirdIconSpring' )
      )
    ];

    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode(
      springsIcon[ 0 ],
      mvt,
      tandem.createTandem( 'firstSpringIcon' ),
      {
        frontColor: '#000000',
        middleColor: '#636362',
        backColor: 'black',
      } );
    firstSpringIcon.loopsProperty.set( 6 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode(
      springsIcon[ 1 ],
      mvt,
      tandem.createTandem( 'secondSpringIcon' ),
      {
        frontColor: '#000000',
        middleColor: '#636362',
        backColor: 'black',
      } );
    secondSpringIcon.loopsProperty.set( 6 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    if ( springLengthProperty === 'adjustable-length' ) {

      secondSpringIcon = new OscillatingSpringNode(
        springsIcon[ 2 ],
        mvt,
        tandem.createTandem( 'secondSpringIcon' ),
        {
          frontColor: '#000000',
          middleColor: '#636362',
          backColor: 'black',
        } );
      secondSpringIcon.loopsProperty.set( 3 );
      secondSpringIcon.lineWidthProperty.set( 3 );
    }
    var firstVerticalLineNode = new Line( 60, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 4,
      centerX: firstSpringIcon.centerX,
      top: firstSpringIcon.top
    } );

    var secondVerticalLineNode = new Line( 60, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 4,
      centerX: secondSpringIcon.centerX,
      top: secondSpringIcon.top
    } );

    // @private {read-only} White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.x - 40, -170, 170, 200, 10, 10, {
      fill: '#A8D2FF',
      xMargin: 0,
      yMargin: 0
    } );

    this.addChild( iconBackground );
    this.addChild( firstSpringIcon );
    this.addChild( firstVerticalLineNode );
    this.addChild( secondSpringIcon );
    this.addChild( secondVerticalLineNode );

  }

  massesAndSprings.register( 'SceneSelectionButton', SceneSelectionButton );

  return inherit( Node, SceneSelectionButton );
} );