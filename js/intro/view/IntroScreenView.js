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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LineVisibilityNode = require( 'MASSES_AND_SPRINGS/common/view/LineVisibilityNode' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  var Range = require( 'DOT/Range' );
  var SceneSelectionButton = require( 'MASSES_AND_SPRINGS/intro/view/SceneSelectionButton' );
  var SceneModeChoice = require( 'MASSES_AND_SPRINGS/intro/enum/SceneModeChoice' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TwoSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringScreenView' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
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
    TwoSpringScreenView.call( this, model, tandem );

    // Spring Length Control Panel
    var minMaxLabels = [
      new Text( shortString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 40 } ),
      new Text( longString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 40 } )
    ];

    this.springLengthControlPanel = new SpringControlPanel(
      model.spring1.naturalRestingLengthProperty,
      new Range( 0.1, 0.5 ),
      StringUtils.fillIn( lengthString, { spring: 1 } ),
      minMaxLabels,
      tandem.createTandem( 'springLengthControlPanel' ),
      {
        fill: 'transparent',
        maxWidth: 210,
        xMargin: 5,
        yMargin: 0,
        spacing: 2,
        stroke: null,
        visible: false,
        centerTick: true,
        constrainValue: function( value ) {
          value = Util.roundSymmetric( value * 100 / 5 ) * 5;
          return value / 100;
        }
      }
    );

    // Panel that keeps thickness/spring constant at constant value
    var constantsControlPanel = new ConstantsControlPanel(
      model.constantParameterProperty,
      constantParameterString,
      tandem.createTandem( 'constantsControlPanel' ),
      {
        maxWidth: 210,
        stroke: null
      }
    );

    var lineSeparator = MassesAndSpringsConstants.LINE_SEPARATOR( 130 );

    // VBox that contains all of the spring options panel's content
    var springOptionsNode = new Node( {
      children: [
        this.springLengthControlPanel,
        lineSeparator,
        constantsControlPanel
      ]
    } );

    this.springLengthControlPanel.centerX = this.centerX;
    lineSeparator.centerX = this.centerX;
    lineSeparator.top = this.springLengthControlPanel.bottom + 10;
    constantsControlPanel.centerX = this.centerX - 8;
    constantsControlPanel.top = lineSeparator.bottom + 10;

    // Panel that will display the options for a spring.
    var springOptionsPanel = new Panel(
      springOptionsNode,
      {
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        right: this.firstSpringStopperButtonNode.left - this.spacing,
        top: this.spacing,
        tandem: tandem.createTandem( 'springOptionsPanel' ),
        align: 'center',
        fill: 'white',
        maxWidth: 250,
        xMargin: 0,
        stroke: 'gray',
        resize: false,
        visible: false
      } );
    this.addChild( springOptionsPanel );
    springOptionsPanel.moveToBack();

    // Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    var firstMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );
    var secondMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.secondSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );

    // Initializes equilibrium line for first spring
    var firstSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.equilibriumYPositionProperty,
      firstMassEquilibriumVisibilityProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );

    // Initializes equilibrium line for second spring
    var secondSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.equilibriumYPositionProperty,
      secondMassEquilibriumVisibilityProperty, {
        stroke: EQUILIBRIUM_LINE_FILL
      }
    );
    //Reference lines from indicator visibility box
    this.addChild( firstSpringEquilibriumLineNode );
    this.addChild( secondSpringEquilibriumLineNode );

    // We do this to prevent overlap with the massNodes.
    firstSpringEquilibriumLineNode.moveToBack();
    secondSpringEquilibriumLineNode.moveToBack();


    // Link responsible for visibility of the length control panel.
    model.sceneModeProperty.lazyLink( function( mode ) {
      self.resetMassLayer();
      if ( mode === SceneModeChoice.SAME_LENGTH ) {
        self.springLengthControlPanel.visible = false;
      }
      else if ( mode === SceneModeChoice.ADJUSTABLE_LENGTH ) {
        self.springLengthControlPanel.visible = true;
      }

      // Manages visibility of panels for spring constant and thickness
      constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      springOptionsPanel.visible = self.springLengthControlPanel.visible;
    } );

    // Creation of same length icon node
    var sameLengthIcon = new SceneSelectionButton( SceneModeChoice.SAME_LENGTH, this.modelViewTransform, tandem );

    // Creation of adjustable length icon node
    var differentLengthIcon = new SceneSelectionButton( SceneModeChoice.ADJUSTABLE_LENGTH, this.modelViewTransform, tandem );

    //  Creation of toggled modes for scene selection
    var toggleButtonsContent = [ {
      value: SceneModeChoice.SAME_LENGTH,
      node: sameLengthIcon
    }, {
      value: SceneModeChoice.ADJUSTABLE_LENGTH,
      node: differentLengthIcon
    } ];

    // Creation of icons for scene selection
    var sceneRadioButtonGroup = new RadioButtonGroup( model.sceneModeProperty, toggleButtonsContent, {
      buttonContentXMargin: 1,
      buttonContentYMargin: 1,
      right: this.gravityAndDampingControlNode.right,
      baseColor: 'black',
      selectedLineWidth: 2,
      deselectedLineWidth: .5,
      deselectedButtonOpacity: 0.25,
      orientation: 'horizontal',
      spacing: 10
    } );

    // Control Panel for display elements with varying visibility
    var lineVisibilityNode = new LineVisibilityNode( model, tandem.createTandem( 'LineVisibilityNode' ) );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        lineVisibilityNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = this.createOptionsPanel( optionsVBox, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolBox
    var rightPanelsVBox = new VBox( {
      children: [ optionsPanel, self.toolboxPanel, sceneRadioButtonGroup ],
      spacing: this.spacing * 0.9
    } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    // Move this plane to the back of the scene graph
    this.backgroundDragNode.moveToBack();

    this.visibleBoundsProperty.link( function() {
      rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.springSystemControlsNode.top );
      springOptionsPanel.right = self.firstSpringStopperButtonNode.left + 168;
      springOptionsPanel.top = self.springSystemControlsNode.top;
    } );
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringScreenView, IntroScreenView );
} );