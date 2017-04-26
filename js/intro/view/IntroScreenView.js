// Copyright 2017, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/ConstantsControlPanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var SpringLengthControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/SpringLengthControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = .3;

  // strings
  var constantString = require( 'string!MASSES_AND_SPRINGS/constant' );

  // TODO: Move model elements into IntroModel and out of CommonModel and IntroScreenView
  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {

    var self = this;
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );

    // Spring Constant Length Control Panel
    this.springLengthControlPanel = new SpringLengthControlPanel(
      model.spring1.naturalRestingLengthProperty,
      new RangeWithValue( .1, .5, .3 ),
      StringUtils.format( 'Length 1', 1 ),
      tandem.createTandem( 'springLengthControlPanel' ),
      {
        right: this.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      } );
    this.addChild( this.springLengthControlPanel );

    // @private panel that keeps thickness/spring constant at constant value
    this.constantsControlPanel = new ConstantsControlPanel(
      model.constantParameterProperty,
      constantString,
      tandem.createTandem( 'constantsControlPanel' ),
      {
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 60,
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.topSpacing
      }
    );
    this.addChild( this.constantsControlPanel );

    // Link responsible for visibility of the length control panel.
    model.sceneModeProperty.lazyLink( function( mode ) {
      self.resetMassLayer();

      if ( mode === 'same-length' ) {
        self.springLengthControlPanel.visible = false;
      }
      else if ( mode === 'adjustable-length' ) {
        self.springLengthControlPanel.visible = true;
      }

      // Manages visibility of panels for spring constant and thickness
      self.constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
    } );

    // @public {read-only} Springs created to be used in the icons for the scene selection tabs
    this.springsIcon = [
      new Spring(
        new Vector2( .65, model.ceilingY ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new RangeWithValue( 5, 15, 9 ),
        0,
        tandem.createTandem( 'firstIconSpring' )
      ),
      new Spring(
        new Vector2( .85, model.ceilingY ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new RangeWithValue( 5, 15, 9 ),
        0,
        tandem.createTandem( 'secondIconSpring' )
      ),
      new Spring(
        new Vector2( .65, model.ceilingY + .17 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new RangeWithValue( 5, 15, 9 ),
        0,
        tandem.createTandem( 'thirdIconSpring' )
      )
    ];

    //TODO: Create a specific file for this?
    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode(
      this.springsIcon[ 0 ],
      this.modelViewTransform2,
      tandem.createTandem( 'firstSpringIcon' )
    );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode(
      this.springsIcon[ 1 ],
      this.modelViewTransform2,
      tandem.createTandem( 'secondSpringIcon' )
    );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var thirdSpringIcon = new OscillatingSpringNode(
      this.springsIcon[ 2 ],
      this.modelViewTransform2,
      tandem.createTandem( 'thirdSpringIcon' )
    );
    thirdSpringIcon.loopsProperty.set( 5 );
    thirdSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.x - 40, 25, 160, 190, 2, 2, { fill: 'white' } );

    // @private {read-only} Creation of same length icon node
    var sameLengthIcon = new Node( { scale: IMAGE_SCALE } );
    sameLengthIcon.addChild( iconBackground );
    sameLengthIcon.addChild( firstSpringIcon );
    sameLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of adjustable length icon node
    var differentLengthIcon = new Node( { scale: IMAGE_SCALE } );
    differentLengthIcon.addChild( iconBackground );
    differentLengthIcon.addChild( thirdSpringIcon );
    differentLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of toggled modes for scene selection
    var toggleButtonsContent = [ {
      value: 'same-length',
      node: sameLengthIcon
    }, {
      value: 'adjustable-length',
      node: differentLengthIcon
    } ];

    // @private {read-only} Creation of icons for scene selection
    var sceneRadioButtonGroup = new RadioButtonGroup( model.sceneModeProperty, toggleButtonsContent, {
      buttonContentXMargin: 4,
      buttonContentYMargin: 4,
      top: this.toolboxPanel.bottom + 55,
      right: this.gravityControlPanel.right,
      baseColor: 'black',
      selectedStroke: 'yellow',
      deselectedStroke: 'yellow',
      selectedLineWidth: 1.3,
      deselectedLineWidth: 0.6,
      orientation: 'horizontal',
      spacing: 13
    } );
    this.addChild( sceneRadioButtonGroup );
    sceneRadioButtonGroup.moveToBack();
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );