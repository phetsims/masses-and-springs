// Copyright 2016-2017, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = 0.3;

  // strings
  var constantString = require( 'string!MASSES_AND_SPRINGS/constant' );
  var lengthString = require( 'string!MASSES_AND_SPRINGS/length' );

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
    this.springLengthControlPanel = new SpringControlPanel(
      model.spring1.naturalRestingLengthProperty,
      new RangeWithValue( 0.1, 0.5, 0.3 ),
      StringUtils.fillIn( lengthString, { spring: 1 } ),
      tandem.createTandem( 'springLengthControlPanel' ),
      {
        right: this.firstSpringStopperButtonNode.left - this.spacing,
        fill: 'white',
        stroke: 'gray',
        top: this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30,
        visible: false,
        constrainValue: function( value ) {
          value = Number( Util.toFixed( value, 2 ) );
          return value;
        }
      }
    );
    this.addChild( this.springLengthControlPanel );

    // @private panel that keeps thickness/spring constant at constant value
    this.constantsControlPanel = new ConstantsControlPanel(
      model.constantParameterProperty,
      constantString,
      tandem.createTandem( 'constantsControlPanel' ),
      {
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30,
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
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
    var springsIcon = [
      new Spring(
        new Vector2( 0.65, MassesAndSpringsConstants.CEILING_Y ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'firstIconSpring' )
      ),
      new Spring(
        new Vector2( 0.85, MassesAndSpringsConstants.CEILING_Y ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'secondIconSpring' )
      ),
      new Spring(
        new Vector2( 0.65, MassesAndSpringsConstants.CEILING_Y + 0.17 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'thirdIconSpring' )
      )
    ];

    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode(
      springsIcon[ 0 ],
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 0.98 ),
      tandem.createTandem( 'firstSpringIcon' )
    );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode(
      springsIcon[ 1 ],
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 0.98 ),
      tandem.createTandem( 'secondSpringIcon' )
    );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var thirdSpringIcon = new OscillatingSpringNode(
      springsIcon[ 2 ],
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 0.98 ),
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
      right: this.gravityAndDampingControlPanel.right,
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

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      sceneRadioButtonGroup.right = visibleBounds.right - self.spacing;
    } );
    this.gravityAndDampingControlPanel.gravityNumberDisplay.visible = false;
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );