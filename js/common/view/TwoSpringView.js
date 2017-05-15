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
  var EquilibriumLineNode = require( 'MASSES_AND_SPRINGS/common/view/EquilibriumLineNode' );
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/common/view/IndicatorVisibilityControlPanel' );
  var MASPlayPauseStepControl = require( 'MASSES_AND_SPRINGS/common/view/MASPlayPauseStepControl' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var NaturalLengthLineNode = require( 'MASSES_AND_SPRINGS/common/view/NaturalLengthLineNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
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
  function TwoSpringView( model, tandem ) {
    this.model = model; // Make model available for reset
    var self = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

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
    this.topSpacing = modelViewTransform2.modelToViewY( model.ceilingY );

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

    //  TODO: put in a vbox?? hmm... wrong place for this comment??
    this.firstOscillatingSpringNode = new OscillatingSpringNode(
      model.springs[ 0 ],
      modelViewTransform2SpringHeight,
      tandem.createTandem( 'firstOscillatingSpringNode' )
    );
    this.secondOscillatingSpringNode = new OscillatingSpringNode(
      model.springs[ 1 ],
      modelViewTransform2SpringHeight,
      tandem.createTandem( 'secondOscillatingSpringNode' )
    );

    // Spring Hanger Node
    this.springHangerNode = new SpringHangerNode(
      model,
      modelViewTransform2,
      tandem.createTandem( 'springHangerNode' )
    );

    // Spring Constant Control Panels
    this.firstSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.format( springConstantString, 1 ),
      tandem.createTandem( 'firstSpringConstantControlPanel' ),
      {
        right: this.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30
      } );

    this.secondSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 1 ].springConstantProperty,
      model.springs[ 1 ].springConstantRange,
      StringUtils.format( springConstantString, 2 ),
      tandem.createTandem( 'secondSpringConstantControlPanel' ),
      {
        left: this.springHangerNode.right + 40,
        top: this.topSpacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30
      } );

    // @public Initializes movable line
    this.movableLineNode = new MovableLineNode(
      this.layoutBounds.getCenter().minus( new Vector2( 45, 0 ) ),
      235,
      model.movableLineVisibleProperty,
      330,
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes equilibrium line for first spring
    this.firstSpringEquilibriumLineNode = new EquilibriumLineNode(
      modelViewTransform2,
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'firstSpringEquilibriumLineNode' )
    );

    // @public Initializes equilibrium line for second spring
    this.secondSpringEquilibriumLineNode = new EquilibriumLineNode(
      modelViewTransform2,
      model.springs[ 1 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'secondSpringEquilibriumLineNode' )
    );

    // @public Initializes natural line for first spring
    this.firstNaturalLengthLineNode = new NaturalLengthLineNode(
      modelViewTransform2,
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'firstNaturalLengthLineNode' )
    );

    // @public Initializes natural line for second spring
    this.secondNaturalLengthLineNode = new NaturalLengthLineNode(
      modelViewTransform2,
      model.springs[ 1 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'secondNaturalLengthLineNode' )
    );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ),
      {
        top: this.topSpacing,
        right: this.layoutBounds.getMaxX() - this.topSpacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );

    // Gravity Control Panel
    this.gravityAndFrictionControlPanel = new GravityAndFrictionControlPanel(
      false,
      model.frictionProperty,
      model.frictionRangeProperty,
      model.gravityProperty,
      model.gravityRangeProperty,
      model.bodyTitleProperty,
      model.bodies,
      this,
      tandem.createTandem( 'gravityAndFrictionControlPanel' ),
      {
        right: this.layoutBounds.getMaxX() - this.topSpacing,
        top: indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );

    // Timer and Ruler
    var timerNode = new DraggableTimerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 80, this.topSpacing + 35 ),
      model.timerSecondProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'timerNode' )
    );
    var rulerNode = new DraggableRulerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 50, this.topSpacing + 35 ),
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
      bottom: modelViewTransform2.modelToViewY( model.floorY ),
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // Play/Pause and Step Forward Button Control
    var MASPlayPauseStepControlNode = new MASPlayPauseStepControl(
      model,
      this.layoutBounds,
      tandem.createTandem( 'MASPlayPauseStepControlNode' )
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

    var firstSpringStopperButtonNode = new SpringStopperButtonNode(
      tandem.createTandem( 'firstSpringStopperButtonNode' ),
      {
        listener: model.stopSpring.bind( model, 0 ),
        right: this.springHangerNode.left - 5,
        top: this.topSpacing
      }
    );
    var secondSpringStopperButtonNode = new SpringStopperButtonNode(
      tandem.createTandem( 'secondSpringStopperButtonNode' ),
      {
        listener: model.stopSpring.bind( model, 1 ),
        left: this.springHangerNode.right + 5,
        top: this.topSpacing
      }
    );

    // Adding all of the nodes to the scene graph
    this.addChild( this.firstOscillatingSpringNode );
    this.addChild( this.secondOscillatingSpringNode );
    this.addChild( this.springHangerNode );

    // Adding Panels to scene graph
    this.addChild( this.firstSpringConstantControlPanel );
    this.addChild( this.secondSpringConstantControlPanel );
    this.addChild( indicatorVisibilityControlPanel );
    this.addChild( this.gravityAndFrictionControlPanel );
    this.addChild( this.toolboxPanel );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( MASPlayPauseStepControlNode );
    this.addChild( speedControl );
    this.addChild( firstSpringStopperButtonNode );
    this.addChild( secondSpringStopperButtonNode )
    ;
    //Reference lines from indicator visibility box
    this.addChild( this.firstSpringEquilibriumLineNode );
    this.addChild( this.secondSpringEquilibriumLineNode );
    this.addChild( this.firstNaturalLengthLineNode );
    this.addChild( this.secondNaturalLengthLineNode );
    this.addChild( this.movableLineNode );
    this.addChild( this.massLayer );

    // Adding Nodes in tool box
    this.addChild( timerNode );
    this.addChild( rulerNode );
  }

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( ScreenView, TwoSpringView );
} );