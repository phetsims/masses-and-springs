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
  var ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/ConstantsControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var GravityAndDampingControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlPanel' );
  var ReferenceLinePanel = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLinePanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Panel = require( 'SUN/Panel' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var IMAGE_SCALE = 0.3;
  var EQUILIBRIUM_LINE_FILL = 'rgb(0, 180, 0)';

  // strings
  var constantParameterString = require( 'string!MASSES_AND_SPRINGS/constantParameter' );
  var lengthString = require( 'string!MASSES_AND_SPRINGS/length' );
  var longString = require( 'string!MASSES_AND_SPRINGS/long' );
  var shortString = require( 'string!MASSES_AND_SPRINGS/short' );

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {

    var self = this;
    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );

    // Spring Length Control Panel
    var minMaxLabels = [
      new Text( shortString, { font: MassesAndSpringsConstants.LABEL_FONT } ),
      new Text( longString, { font: MassesAndSpringsConstants.LABEL_FONT } )
    ];
    this.springLengthControlPanel = new SpringControlPanel(
      model.spring1.naturalRestingLengthProperty,
      new RangeWithValue( 0.1, 0.5, 0.3 ),
      StringUtils.fillIn( lengthString, { spring: 1 } ),
      minMaxLabels,
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
      constantParameterString,
      tandem.createTandem( 'constantsControlPanel' ),
      {
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30,
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      }
    );
    this.addChild( this.constantsControlPanel );

    // Initializes equilibrium line for first spring
    var firstSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.springs[ 0 ].equilibriumYPositionProperty,
      model.equilibriumPositionVisibleProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );

    // Initializes equilibrium line for second spring
    var secondSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.springs[ 1 ].equilibriumYPositionProperty,
      model.equilibriumPositionVisibleProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );
    //Reference lines from indicator visibility box
    this.addChild( firstSpringEquilibriumLineNode );
    this.addChild( secondSpringEquilibriumLineNode );

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
        new Vector2( 0.65, 2 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'firstIconSpring' )
      ),
      new Spring(
        new Vector2( 0.85, 2 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'secondIconSpring' )
      ),
      new Spring(
        new Vector2( 0.65, 2.17 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        0,
        tandem.createTandem( 'thirdIconSpring' )
      )
    ];

    // @private {read-only} Creation of spring for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode(
      springsIcon[ 0 ],
      this.modelViewTransform,
      tandem.createTandem( 'firstSpringIcon' )
    );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var secondSpringIcon = new OscillatingSpringNode(
      springsIcon[ 1 ],
      this.modelViewTransform,
      tandem.createTandem( 'secondSpringIcon' )
    );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} Creation of spring for use in scene switching icons
    var thirdSpringIcon = new OscillatingSpringNode(
      springsIcon[ 2 ],
      this.modelViewTransform,
      tandem.createTandem( 'thirdSpringIcon' )
    );
    thirdSpringIcon.loopsProperty.set( 5 );
    thirdSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.x - 40, -170, 160, 200, 2, 2, { fill: 'white' } );

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

    // Control Panel for display elements with varying visibility
    var referenceLinePanel = new ReferenceLinePanel(
      model,
      tandem.createTandem( 'ReferenceLinePanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      }
    );

    // Gravity Control Panel
    var gravityAndDampingControlPanel = new GravityAndDampingControlPanel(
      model, this, tandem.createTandem( 'gravityAndDampingControlPanel' ), {
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        hSlider: true
      } );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        referenceLinePanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        gravityAndDampingControlPanel
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = new Panel(
      optionsVBox,
      {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'ReferenceLinePanel' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH,
        resize: false
      } );
    this.addChild( optionsPanel );
    optionsPanel.moveToBack();

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      optionsPanel.top = self.secondSpringConstantControlPanel.top;
      optionsPanel.right = self.panelRightSpacing;
      self.toolboxPanel.top = optionsPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
      self.toolboxPanel.right = self.panelRightSpacing;
      sceneRadioButtonGroup.right = self.panelRightSpacing;
      sceneRadioButtonGroup.top = self.toolboxPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
    } );
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );