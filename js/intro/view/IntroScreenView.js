// Copyright 2016-2023, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { AlignBox, AlignGroup, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import Panel from '../../../../sun/js/Panel.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import ConstantMode from '../../common/model/ConstantMode.js';
import SceneMode from '../../common/model/SceneMode.js';
import LineVisibilityNode from '../../common/view/LineVisibilityNode.js';
import MassesAndSpringsColors from '../../common/view/MassesAndSpringsColors.js';
import ReferenceLineNode from '../../common/view/ReferenceLineNode.js';
import SpringControlPanel from '../../common/view/SpringControlPanel.js';
import TwoSpringScreenView from '../../common/view/TwoSpringScreenView.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import ConstantsControlPanel from './ConstantsControlPanel.js';
import SceneSelectionButton from './SceneSelectionButton.js';

const constantParameterString = MassesAndSpringsStrings.constantParameter;
const lengthString = MassesAndSpringsStrings.length;
const longString = MassesAndSpringsStrings.long;
const shortString = MassesAndSpringsStrings.short;

class IntroScreenView extends TwoSpringScreenView {

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    super( model, tandem );

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
        constrainValue: value => Utils.roundToInterval( value, 0.05 )
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
      ],
      excludeInvisibleChildrenFromBounds: false
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
      ( equilibriumPositionVisible, massAttached ) => {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );
    const secondMassEquilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.secondSpring.massAttachedProperty ],
      ( equilibriumPositionVisible, massAttached ) => {
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
        stroke: MassesAndSpringsColors.restingPositionProperty
      }
    );

    // Initializes equilibrium line for second spring
    const secondSpringEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.equilibriumYPositionProperty,
      secondMassEquilibriumVisibilityProperty, {
        stroke: MassesAndSpringsColors.restingPositionProperty
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
    model.sceneModeProperty.lazyLink( mode => {
      this.resetMassLayer();
      if ( mode === SceneMode.SAME_LENGTH ) {
        this.springLengthControlPanel.visible = false;
      }
      else if ( mode === SceneMode.ADJUSTABLE_LENGTH ) {
        this.springLengthControlPanel.visible = true;
      }

      // Manages visibility of panels for spring constant and thickness
      constantsControlPanel.visible = this.springLengthControlPanel.visible;
      this.firstSpringConstantControlPanel.visible = !this.springLengthControlPanel.visible;
      this.secondSpringConstantControlPanel.visible = !this.springLengthControlPanel.visible;
      springOptionsPanel.visible = this.springLengthControlPanel.visible;
    } );

    // Creation of same length icon node
    const sameLengthIcon = new SceneSelectionButton( SceneMode.SAME_LENGTH, model.sceneModeProperty, this.modelViewTransform, tandem );

    // Creation of adjustable length icon node
    const differentLengthIcon = new SceneSelectionButton( SceneMode.ADJUSTABLE_LENGTH, model.sceneModeProperty, this.modelViewTransform, tandem );

    //  Creation of toggled modes for scene selection
    const toggleButtonsContent = [ {
      value: SceneMode.SAME_LENGTH,
      createNode: () => sameLengthIcon
    }, {
      value: SceneMode.ADJUSTABLE_LENGTH,
      createNode: () => differentLengthIcon
    } ];

    // Creation of icons for scene selection
    const sceneRadioButtonGroup = new RectangularRadioButtonGroup( model.sceneModeProperty, toggleButtonsContent, {
      right: this.gravityAndDampingControlNode.right,
      orientation: 'horizontal',
      spacing: 10,
      radioButtonOptions: {
        xMargin: 1,
        yMargin: 1,
        baseColor: 'black',
        buttonAppearanceStrategyOptions: {
          selectedLineWidth: 2,
          deselectedLineWidth: 0.5,
          deselectedButtonOpacity: 0.25
        }
      }
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
      children: [ optionsPanel, this.toolboxPanel, sceneRadioButtonGroup ],
      spacing: this.spacing * 0.9
    } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    // Move this plane to the back of the scene graph
    this.backgroundDragPlane.moveToBack();

    this.visibleBoundsProperty.link( () => {
      rightPanelsVBox.rightTop = new Vector2( this.panelRightSpacing, this.springSystemControlsNode.top );
      springOptionsPanel.leftTop = this.springSystemControlsNode.leftTop.minus( new Vector2( 0, 0 ) );
    } );
  }
}

massesAndSprings.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;