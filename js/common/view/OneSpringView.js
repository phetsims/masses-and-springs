// Copyright 2017, University of Colorado Boulder

/**
 * Common ScreenView for  using two masses.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityAndFrictionControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndFrictionControlPanel' );
  var DraggableRulerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableRulerNode' );
  var DraggableTimerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableTimerNode' );
  var EnergyGraphNode = require( 'MASSES_AND_SPRINGS/common/view/EnergyGraphNode' );
  var EquilibriumLineNode = require( 'MASSES_AND_SPRINGS/common/view/EquilibriumLineNode' );
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/common/view/IndicatorVisibilityControlPanel' );
  var TimeControlPanel = require( 'MASSES_AND_SPRINGS/common/view/TimeControlPanel' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var NaturalLengthLineNode = require( 'MASSES_AND_SPRINGS/common/view/NaturalLengthLineNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MassValueControlPanel = require( 'MASSES_AND_SPRINGS/common/view/MassValueControlPanel' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SingleSpringHangerNode = require( 'MASSES_AND_SPRINGS/energy/view/SingleSpringHangerNode' );
  var SpringConstantControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringConstantControlPanel' );
  var SpringStopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/SpringStopperButtonNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ToolboxPanel = require( 'MASSES_AND_SPRINGS/common/view/ToolboxPanel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var normalString = require( 'string!MASSES_AND_SPRINGS/normal' );
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var slowMotionString = require( 'string!MASSES_AND_SPRINGS/slowMotion' );

  // constants
  var MAX_TEXT_WIDTH = 80;

  /**
   * TODO::: Remove modelViewTransform2 transforms from view objects
   * TODO::: Factor out colors to a Constants object
   * TODO::: Factor out thumb size, track size, etc other slider properties
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function OneSpringView( model, tandem ) {
    this.model = model; // Make model available for reset
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 850, 504 ) } );

    // Needed for grey bar above springHangerNode
    var modelViewTransform2SpringHeight = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * 1 ),
      397 );
    this.modelViewTransform2 = modelViewTransform2SpringHeight; // Make modelViewTransform2 available to descendant types.

    var modelViewTransform2 = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .98 ),
      397 );
    this.modelViewTransform2 = modelViewTransform2; // Make modelViewTransform2 available to descendant types.

    //Spacing for top margin of layout bounds
    this.spacing = modelViewTransform2.modelToViewY( MassesAndSpringsConstants.CEILING_Y );

    // Alignment for panels on most right side of sim view
    var rightPanelAlignment = this.layoutBounds.right - this.spacing;

    // Add masses
    this.massLayer = new Node( { tandem: tandem.createTandem( 'massLayer' ) } );
    var massNodes = [];
    for ( var property in model.masses ) {
      if ( !model.masses.hasOwnProperty( property ) ) {
        continue;
      }
      var referencedMassProperty = model.masses[ property ];
      var massNode = new MassNode(
        referencedMassProperty,
        model.showVectors,
        modelViewTransform2,
        self,
        model,
        tandem.createTandem( referencedMassProperty.tandem.tail + 'Node' ) );
      this.massLayer.addChild( massNode );

      // Keeps track of the mass node to restore original Z order.
      massNodes.push( massNode );
    }

    // @protected Helper function to restore initial layering of the masses to prevent them from stacking over each other.
    this.resetMassLayer = function() {
      massNodes.forEach( function( massNode ) {
        massNode.moveToFront();
      } );
    };

    this.oscillatingSpringNode = new OscillatingSpringNode(
      model.springs[ 0 ],
      modelViewTransform2SpringHeight,
      tandem.createTandem( 'oscillatingSpringNode' )
    );

    var singleSpringHangerNode = new SingleSpringHangerNode( tandem.createTandem( 'singleSpringHangerNode' ) );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ), {
        top: this.spacing,
        right: rightPanelAlignment,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      } );

    // Spring Constant Control Panel
    var springConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.fillIn( springConstantString, { spring: 2 } ),
      tandem.createTandem( 'springConstantControlPanel' ), {
        right: indicatorVisibilityControlPanel.left - this.spacing,
        top: this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30
      } );

    singleSpringHangerNode.top = springConstantControlPanel.top;

    // @public Initializes movable line
    this.movableLineNode = new MovableLineNode(
      singleSpringHangerNode.getCenter().plus( new Vector2( 45, 200 ) ),
      100,
      model.movableLineVisibleProperty,
      475,
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes equilibrium line for second spring
    this.secondSpringEquilibriumLineNode = new EquilibriumLineNode(
      modelViewTransform2,
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'secondSpringEquilibriumLineNode' )
    );

    // @public Initializes natural line for second spring
    this.secondNaturalLengthLineNode = new NaturalLengthLineNode(
      modelViewTransform2,
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'secondNaturalLengthLineNode' )
    );

    // Gravity Control Panel
    this.gravityAndFrictionControlPanel = new GravityAndFrictionControlPanel(
      model, true, this, tandem.createTandem( 'gravityAndFrictionControlPanel' ),
      {
        right: rightPanelAlignment,
        top: indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );

    // Timer and Ruler
    var timerNode = new DraggableTimerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 80, this.spacing + 35 ),
      model.timerSecondProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'timerNode' )
    );
    var rulerNode = new DraggableRulerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 50, this.spacing + 35 ),
      model.rulerVisibleProperty,
      tandem.createTandem( 'rulerNode' )
    );

    // Toolbox Panel
    this.toolboxPanel = new ToolboxPanel(
      this.layoutBounds,
      rulerNode, timerNode,
      model.rulerVisibleProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ),
      {
        top: this.gravityAndFrictionControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        left: this.gravityAndFrictionControlPanel.left,
        minWidth: this.gravityAndFrictionControlPanel.width,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      } );

    // Done to for movableDragHandler handling intersecting bounds of panel and ruler
    rulerNode.toolbox = this.toolboxPanel;
    timerNode.toolbox = this.toolboxPanel;

    // Reset All button
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        // Done to preserve layering order to initial state. Prevents masses from stacking over each other.
        self.resetMassLayer();
      },
      right: this.layoutBounds.right - 10,
      bottom: modelViewTransform2.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ),
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Play/Pause and Step Forward Button Control
    var timeControlPanel = new TimeControlPanel(
      model,
      this.layoutBounds,
      tandem.createTandem( 'timeControlPanel' )
    );

    // Sim speed controls
    var speedSelectionButtonOptions = {
      font: new PhetFont( 14 ),
      maxWidth: MAX_TEXT_WIDTH
    };
    var speedSelectionButtonRadius = 8;
    var normalText = new Text( normalString, speedSelectionButtonOptions, { tandem: tandem.createTandem( 'normalString' ) } );
    var normalMotionRadioBox = new AquaRadioButton( model.simSpeedProperty, 'normal', normalText, {
      radius: speedSelectionButtonRadius,
      tandem: tandem.createTandem( 'normalMotionRadioBox' )
    } );

    var slowText = new Text( slowMotionString, speedSelectionButtonOptions, { tandem: tandem.createTandem( 'slowText' ) } );
    var slowMotionRadioBox = new AquaRadioButton( model.simSpeedProperty, 'slow', slowText, {
      radius: speedSelectionButtonRadius,
      tandem: tandem.createTandem( 'normalMotionRadioBox' )
    } );

    var radioButtonSpacing = 4;
    var speedControl = new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [ normalMotionRadioBox, slowMotionRadioBox ],
      right: this.resetAllButton.left - 30,
      centerY: this.resetAllButton.centerY,
      tandem: tandem.createTandem( 'speedControl' )
    } );

    var springStopperButtonNode = new SpringStopperButtonNode(
      tandem.createTandem( 'springStopperButtonNode' ), {
        listener: model.stopSpring.bind( model, 0 ),
        right: springConstantControlPanel.left - this.spacing,
        top: this.spacing
      }
    );

    var energyGraphNode = new EnergyGraphNode( model );
    energyGraphNode.top = this.layoutBounds.top + this.spacing;
    energyGraphNode.left = this.layoutBounds.left + this.spacing;


    var massValueControlPanel = new MassValueControlPanel(
      model.masses.adjustableMass,
      tandem.createTandem( 'massValueControlPanel' )
    );
    massValueControlPanel.bottom = this.layoutBounds.getMaxY() - this.spacing;
    massValueControlPanel.left = energyGraphNode.right + this.spacing;
    singleSpringHangerNode.right = springStopperButtonNode.left - this.spacing;


    //TODO: Make this an array. this.children = [] and add this as an option object. Follow Griddle VerticalBarChart as example.
    // Adding all of the nodes to the scene graph
    this.addChild( this.oscillatingSpringNode );

    // Adding Panels to scene graph
    this.addChild( singleSpringHangerNode );
    this.addChild( massValueControlPanel );
    this.addChild( springConstantControlPanel );
    this.addChild( indicatorVisibilityControlPanel );
    this.addChild( this.gravityAndFrictionControlPanel );
    this.addChild( this.toolboxPanel );
    this.addChild( energyGraphNode );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( timeControlPanel );
    this.addChild( speedControl );
    this.addChild( springStopperButtonNode );

    //Reference lines from indicator visibility box
    this.addChild( this.secondSpringEquilibriumLineNode );
    this.addChild( this.secondNaturalLengthLineNode );
    this.addChild( this.movableLineNode );
    this.addChild( this.massLayer );

    // Adding Nodes in tool box
    this.addChild( timerNode );
    this.addChild( rulerNode );
  }

  massesAndSprings.register( 'OneSpringView', OneSpringView );

  return inherit( ScreenView, OneSpringView );
} );