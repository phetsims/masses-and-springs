// Copyright 2018, University of Colorado Boulder

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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = 0.3;

  /**
   * @param {string} springLength
   * @param {ModelViewTransform2} mvt
   * @param {Tandem} tandem
   * @constructor
   */
  function SceneSelectionButton( springLength, mvt, tandem ) {

    Node.call( this, {
      scale: IMAGE_SCALE,
      opacity: 0.9
    } );

    // Springs created to be used in the icons for the scene selection tabs
    var springsIcon = [
      new Spring(
        new Vector2( 0.65, 2.1 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new NumberProperty (0),
        new NumberProperty(0),
        tandem.createTandem( 'firstIconSpring' )
      ),
      new Spring(
        new Vector2( 0.85, 2.1 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new NumberProperty (0),
        new NumberProperty(0),
        tandem.createTandem( 'secondIconSpring' )
      )
    ];

    // Creation of spring for use in scene switching icons
    var springNodeOptions = {
      frontColor: '#000000',
      middleColor: '#636362',
      backColor: 'black',
      opacity: 0.8
    };
    var firstSpringIcon = new OscillatingSpringNode(
      springsIcon[ 0 ],
      mvt,
      tandem.createTandem( 'firstSpringIcon' ),
      springNodeOptions );
    //REVIEW: Can this be in the options?
    firstSpringIcon.loopsProperty.set( 6 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode(
      springsIcon[ 1 ],
      mvt,
      tandem.createTandem( 'secondSpringIcon' ),
      springNodeOptions
    );
    //REVIEW: Can this be in the options?
    secondSpringIcon.loopsProperty.set( 6 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    if ( springLength === 'adjustable-length' ) {

      firstSpringIcon = new OscillatingSpringNode(
        springsIcon[ 0 ],
        mvt,
        tandem.createTandem( 'secondSpringIcon' ),
        springNodeOptions
      );
      firstSpringIcon.loopsProperty.set( 3 );
      firstSpringIcon.lineWidthProperty.set( 3 );
      firstSpringIcon.top = secondSpringIcon.top;
    }
    var firstVerticalLineNode = new Line( 60, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 4,
      centerX: firstSpringIcon.centerX,
      top: firstSpringIcon.top,
      opacity: this.opacity // REVIEW: Nested opacity, so the true opacity here is 0.9 * 0.9? Is that desired?
    } );

    var secondVerticalLineNode = new Line( 60, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 4,
      centerX: secondSpringIcon.centerX,
      top: secondSpringIcon.top,
      opacity: this.opacity // REVIEW: Nested opacity, so the true opacity here is 0.9 * 0.9? Is that desired?
    } );

    // White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.left - 20, -170, 180, 170, 10, 10, {
      fill: '#A8D2FF'
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