// Copyright 2017, University of Colorado Boulder

/**
 * Common ScreenView for  using two masses.
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityControlPanel' );
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
   * TODO::: Remove mvt transforms from view objects
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
    var mvtSpringHeight = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * 1 ),
      397 );
    this.mvt = mvtSpringHeight; // Make mvt available to descendant types.

    var mvt = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( 0, this.layoutBounds.height * .98 ),
      397 );
    this.mvt = mvt; // Make mvt available to descendant types.

    //Spacing for top margin of layout bounds
    this.topSpacing = mvt.modelToViewY( model.ceilingY );

    // Add masses
    this.massLayer = new Node();
    var massNodes = [];
    model.masses.forEach( function( mass ) {
      var massNode = new MassNode( mass, mvt, self, model );
      self.massLayer.addChild( massNode );
      // Keeps track of the mass node to restore original Z order.
      massNodes.push( massNode );
    } );

    //  TODO: put in a vbox?? hmm... wrong place for this comment??
    this.firstOscillatingSpringNode = new OscillatingSpringNode( model.springs[ 0 ], mvtSpringHeight );
    this.secondOscillatingSpringNode = new OscillatingSpringNode( model.springs[ 1 ], mvtSpringHeight );

    // Spring Hanger Node
    this.springHangerNode = new SpringHangerNode( model, mvt );

    // Spring Constant Control Panels
    this.firstSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.format( springConstantString, 1 ),
      {
        right: this.springHangerNode.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: 125
      } );

    this.secondSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 1 ].springConstantProperty,
      model.springs[ 1 ].springConstantRange,
      StringUtils.format( springConstantString, 2 ),
      {
        left: this.springHangerNode.springHangerNode.right + 40,
        top: this.topSpacing,
        maxWidth: 125
      } );

    // @public Initializes movable line
    this.movableLine = new MovableLineNode(
      this.layoutBounds.getCenter().minus( new Vector2( 45, 0 ) ),
      235,
      model.movableLineVisibleProperty
    );

    // @public Initializes equilibrium line for first spring
    this.firstSpringEquilibriumLine = new EquilibriumLineNode(
      mvt,
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty
    );

    // @public Initializes equilibrium line for second spring
    this.secondSpringEquilibriumLine = new EquilibriumLineNode(
      mvt,
      model.springs[ 1 ],
      model.equilibriumPositionVisibleProperty
    );

    // @public Initializes natural line for first spring
    this.firstNaturalLengthLine = new NaturalLengthLineNode(
      mvt,
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty
    );

    // @public Initializes natural line for second spring
    this.secondNaturalLengthLine = new NaturalLengthLineNode(
      mvt,
      model.springs[ 1 ],
      model.naturalLengthVisibleProperty
    );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel( model, {
      top: this.topSpacing,
      left: this.secondSpringConstantControlPanel.right + 10,
      maxWidth: 180
    } );

    // Gravity Control Panel
    this.gravityControlPanel = new GravityControlPanel(
      model.gravityProperty,
      model.gravityRange,
      model.bodies,
      this,
      tandem,
      {
        left: indicatorVisibilityControlPanel.left,
        top: indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        minWidth: 1,
        maxWidth: 180
      }
    );

    // Timer and Ruler
    var timerNode = new DraggableTimerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 80, this.topSpacing + 35 ),
      model.timerSecondProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty
    );
    var rulerNode = new DraggableRulerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 50, this.topSpacing + 35 ),
      model.rulerVisibleProperty
    );

    // Toolbox Panel
    this.toolboxPanel = new ToolboxPanel( this.layoutBounds, rulerNode, timerNode, model.rulerVisibleProperty, model.timerVisibleProperty, {
      top: this.gravityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
      left: this.gravityControlPanel.left,
      minWidth: this.gravityControlPanel.width,
      maxWidth: 180
    } );

    // Done to for movableDragHandler handling intersecting bounds of panel and ruler
    rulerNode.toolbox = this.toolboxPanel;
    timerNode.toolbox = this.toolboxPanel;

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.springs[ 0 ].reset();
        model.springs[ 1 ].reset();
        model.reset();
        self.gravityControlPanel.reset();
        massNodes.forEach( function( massNode ) {
          massNode.moveToFront();
        } );
      },
      right: this.layoutBounds.right - 10,
      bottom: mvt.modelToViewY( model.floorY )
    } );

    // Play/Pause and Step Forward Button Control
    var MASPlayPauseStepConstrol = new MASPlayPauseStepControl( model );

    // Sim speed controls
    var speedSelectionButtonOptions = {
      font: new PhetFont( 14 ),
      maxWidth: MAX_TEXT_WIDTH
    };
    var speedSelectionButtonRadius = 8;
    var normalText = new Text( normalString, speedSelectionButtonOptions );
    var normalMotionRadioBox = new AquaRadioButton( model.simSpeedProperty, 'normal', normalText, {
      radius: speedSelectionButtonRadius
    } );

    var slowText = new Text( slowMotionString, speedSelectionButtonOptions );
    var slowMotionRadioBox = new AquaRadioButton( model.simSpeedProperty, 'slow', slowText, {
      radius: speedSelectionButtonRadius
    } );

    var radioButtonSpacing = 4;
    var speedControl = new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [ normalMotionRadioBox, slowMotionRadioBox ],
      right: resetAllButton.left - 30,
      centerY: resetAllButton.centerY
    } );

    var firstSpringStopperButtonNode = new SpringStopperButtonNode( {
      listener: model.stopSpring.bind( model, 0 ),
      right: this.springHangerNode.springHangerNode.left - 5,
      top: this.topSpacing
      }
    );
    var secondSpringStopperButtonNode = new SpringStopperButtonNode( {
      listener: model.stopSpring.bind( model, 1 ),
      left: this.springHangerNode.springHangerNode.right + 5,
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
    this.addChild( this.gravityControlPanel );
    this.addChild( this.toolboxPanel );

    // Adding Buttons to scene graph
    this.addChild( resetAllButton );
    this.addChild( MASPlayPauseStepConstrol );
    this.addChild( speedControl );
    this.addChild( firstSpringStopperButtonNode );
    this.addChild( secondSpringStopperButtonNode )
    ;
    //Reference lines from indicator visibility box
    this.addChild( this.firstSpringEquilibriumLine );
    this.addChild( this.secondSpringEquilibriumLine );
    this.addChild( this.firstNaturalLengthLine );
    this.addChild( this.secondNaturalLengthLine );
    this.addChild( this.movableLine );
    this.addChild( this.massLayer );

    // Adding Nodes in tool box
    this.addChild( timerNode );
    this.addChild( rulerNode );
  }

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( ScreenView, TwoSpringView );
} );