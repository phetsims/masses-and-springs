// Copyright 2016-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/ConstantsControlPanel' );
  const ConstantMode = require( 'MASSES_AND_SPRINGS/common/model/ConstantMode' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LineVisibilityNode = require( 'MASSES_AND_SPRINGS/common/view/LineVisibilityNode' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const Panel = require( 'SUN/Panel' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Range = require( 'DOT/Range' );
  const ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  const SceneMode = require( 'MASSES_AND_SPRINGS/common/model/SceneMode' );
  const SceneSelectionButton = require( 'MASSES_AND_SPRINGS/intro/view/SceneSelectionButton' );
  const SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TwoSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringScreenView' );
  const Utils = require( 'DOT/Utils' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const constantParameterString = require( 'string!MASSES_AND_SPRINGS/constantParameter' );
  const lengthString = require( 'string!MASSES_AND_SPRINGS/length' );
  const longString = require( 'string!MASSES_AND_SPRINGS/long' );
  const shortString = require( 'string!MASSES_AND_SPRINGS/short' );

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function IntroScreenView( model, tandem ) {

    const self = this;

    // Calls common two spring view
    TwoSpringScreenView.call( this, model, tandem );

    // AlignGroup to align components for spring options
    const optionsContentAlignGroup = new AlignGroup( { matchVertical: false } );

    // Spring Length Control Panel
    const minMaxLabels = [
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
        alignGroup: optionsContentAlignGroup,
        xMargin: 5,
        yMargin: 0,
        spacing: 2,
        stroke: null,
        visible: false,
        centerTick: true,
        constrainValue: function( value ) {
          return Utils.roundToInterval( value, .05 );
        }
      } );

    // Panel that keeps thickness/spring constant at constant value
    const constantsControlPanel = new AlignBox( new ConstantsControlPanel(
      model.constantModeProperty,
      ConstantMode,
      constantParameterString,
      tandem.createTandem( 'constantsControlPanel' ), {
        maxWidth: 160,
        stroke: null
      } ) );

    const lineSeparator = MassesAndSpringsConstants.LINE_SEPARATOR( 140 );

    // VBox that contains all of the spring options panel's content
    const springOptionsVBox = new VBox( {
      spacing: 10,
      children: [
        this.springLengthControlPanel,
        lineSeparator,
        new AlignBox( constantsControlPanel, { group: optionsContentAlignGroup, xAlign: 'left', leftMargin: 10 } )
      ]
    } );

    const optionsContentAlignBox = new AlignBox( springOptionsVBox, { group: optionsContentAlignGroup } );

    // Panel that contains all the left sided options for the springs
    const springOptionsPanel = new Panel( optionsContentAlignBox, {
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      right: this.firstSpringStopperButtonNode.left - this.spacing,
      top: this.spacing,
      tandem: tandem.createTandem( 'springOptionsPanel' ),
      align: 'left',
      fill: 'white',
      xMargin: 0,
      stroke: 'gray',
      resize: false,
      visible: false
    } );
    this.addChild( springOptionsPanel );
    springOptionsPanel.moveToBack();

    // Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    const firstMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );
    const secondMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.secondSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );

    // Initializes equilibrium line for first spring
    const firstSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.equilibriumYPositionProperty,
      firstMassEquilibriumVisibilityProperty, {
        stroke: MassesAndSpringsColorProfile.restingPositionProperty
      }
    );

    // Initializes equilibrium line for second spring
    const secondSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.equilibriumYPositionProperty,
      secondMassEquilibriumVisibilityProperty, {
        stroke: MassesAndSpringsColorProfile.restingPositionProperty
      }
    );

    // Adding system controls to scene graph
    this.addChild( this.springSystemControlsNode );

    // Reference lines from indicator visibility box
    this.addChild( this.firstNaturalLengthLineNode );
    this.addChild( this.secondNaturalLengthLineNode );
    this.addChild( firstSpringEquilibriumLineNode );
    this.addChild( secondSpringEquilibriumLineNode );
    this.addChild( this.movableLineNode );
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    // Link responsible for visibility of the length control panel.
    model.sceneModeProperty.lazyLink( function( mode ) {
      self.resetMassLayer();
      if ( mode === SceneMode.SAME_LENGTH ) {
        self.springLengthControlPanel.visible = false;
      }
      else if ( mode === SceneMode.ADJUSTABLE_LENGTH ) {
        self.springLengthControlPanel.visible = true;
      }

      // Manages visibility of panels for spring constant and thickness
      constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      springOptionsPanel.visible = self.springLengthControlPanel.visible;
    } );

    // Creation of same length icon node
    const sameLengthIcon = new SceneSelectionButton( SceneMode.SAME_LENGTH, model.sceneModeProperty, this.modelViewTransform, tandem );

    // Creation of adjustable length icon node
    const differentLengthIcon = new SceneSelectionButton( SceneMode.ADJUSTABLE_LENGTH, model.sceneModeProperty, this.modelViewTransform, tandem );

    //  Creation of toggled modes for scene selection
    const toggleButtonsContent = [ {
      value: SceneMode.SAME_LENGTH,
      node: sameLengthIcon
    }, {
      value: SceneMode.ADJUSTABLE_LENGTH,
      node: differentLengthIcon
    } ];

    // Creation of icons for scene selection
    const sceneRadioButtonGroup = new RadioButtonGroup( model.sceneModeProperty, toggleButtonsContent, {
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
    const lineVisibilityNode = new LineVisibilityNode( model, tandem.createTandem( 'LineVisibilityNode' ) );

    // VBox that contains all of the panel's content
    const optionsVBox = new VBox( {
      spacing: 10,
      children: [
        lineVisibilityNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        this.gravityAndDampingControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    const optionsPanel = this.createOptionsPanel( optionsVBox, this.rightPanelAlignGroup, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolbox
    const rightPanelsVBox = new VBox( {
      children: [ optionsPanel, self.toolboxPanel, sceneRadioButtonGroup ],
      spacing: this.spacing * 0.9
    } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();

    this.visibleBoundsProperty.link( function() {
      rightPanelsVBox.rightTop = new Vector2( self.panelRightSpacing, self.springSystemControlsNode.top );
      springOptionsPanel.leftTop = self.springSystemControlsNode.leftTop.minus( new Vector2( 0, 0 ) );
    } );
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringScreenView, IntroScreenView );
} );