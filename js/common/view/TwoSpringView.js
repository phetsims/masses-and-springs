// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Matt Pennington
 * @author Denzell Barnett
 *
 * Common view mode for a screen using two masses.
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
  var Image = require( 'SCENERY/nodes/Image' );
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
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
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
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var normalString = require( 'string!MASSES_AND_SPRINGS/normal' );
  var slowMotionString = require( 'string!MASSES_AND_SPRINGS/slowMotion' );

  // images
  var twoSpringIcon = require( 'image!MASSES_AND_SPRINGS/two-spring-icon.png' );
  var halfSpringIcon = require( 'image!MASSES_AND_SPRINGS/half-spring-icon.png' );

  // constants
  var MAX_TEXT_WIDTH = 80;
  var IMAGE_SCALE = .6;

  /**
   * TODO::: Remove mvt transforms from view objects
   * TODO::: Factor out colors to a Constants object
   * TODO::: Factor out thumb size, track size, etc other slider properties
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function TwoSpringView( model ) {
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
    var topSpacing = mvt.modelToViewY( model.ceilingY );

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
    this.addChild( new OscillatingSpringNode( model.springs[ 0 ], mvtSpringHeight ) );
    this.addChild( new OscillatingSpringNode( model.springs[ 1 ], mvtSpringHeight ) );

    // Spring Hanger Node
    var springHangerNode = new SpringHangerNode( model, mvt );
    this.addChild( springHangerNode );

    // Spring Constant Control Panels
    var firstSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.format( springConstantString, 1 ), {
        right: springHangerNode.springHangerNode.left - 40,
        top: topSpacing,
        maxWidth: 125
      } );
    this.addChild( firstSpringConstantControlPanel );

    var secondSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 1 ].springConstantProperty,
      model.springs[ 1 ].springConstantRange,
      StringUtils.format( springConstantString, 2 ), {
        left: springHangerNode.springHangerNode.right + 40,
        top: topSpacing,
        maxWidth: 125
      } );
    this.addChild( secondSpringConstantControlPanel );

    // Initializes reference lines
    this.movableLine = new MovableLineNode(
      this.layoutBounds.getCenter().minus( new Vector2( 45, 0 ) ),
      235,
      model.movableLineVisibleProperty
    );

    this.firstSpringEquilibriumLine = new EquilibriumLineNode(
      mvt,
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty
    );

    this.secondSpringEquilibriumLine = new EquilibriumLineNode(
      mvt,
      model.springs[ 1 ],
      model.equilibriumPositionVisibleProperty
    );

    this.firstNaturalLengthLine = new NaturalLengthLineNode(
      mvt,
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty
    );
    this.secondNaturalLengthLine = new NaturalLengthLineNode(
      mvt,
      model.springs[ 1 ],
      model.naturalLengthVisibleProperty
    );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel( model, {
      top: topSpacing,
      left: secondSpringConstantControlPanel.right + 10,
      maxWidth: 180
    } );
    this.addChild( indicatorVisibilityControlPanel );

    // Gravity Control Panel
    var gravityControlPanel = new GravityControlPanel(
      model.gravityProperty,
      model.gravityRange,
      model.bodies,
      this,
      {
        left: indicatorVisibilityControlPanel.left,
        top: indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        minWidth: 1,
        maxWidth: 180
      }
    );
    this.addChild( gravityControlPanel );

    // Timer and Ruler
    var timerNode = new DraggableTimerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 80, topSpacing + 35 ),
      model.timerSecondProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty
    );
    var rulerNode = new DraggableRulerNode(
      this.layoutBounds,
      new Vector2( this.layoutBounds.left + 50, topSpacing + 35 ),
      model.rulerVisibleProperty
    );

    // Toolbox Panel
    var toolboxPanel = new ToolboxPanel( this.layoutBounds, rulerNode, timerNode, model.rulerVisibleProperty, model.timerVisibleProperty, {
      top: gravityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
      left: gravityControlPanel.left,
      minWidth: gravityControlPanel.width,
      maxWidth: 180
    } );
    this.addChild( toolboxPanel );
    // Done to for moveableDragHandler handling intersecting bounds of panel and ruler
    rulerNode.toolbox = toolboxPanel;
    timerNode.toolbox = toolboxPanel;

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        gravityControlPanel.reset();
        massNodes.forEach( function( massNode ) {
          massNode.moveToFront();
        } );
      },
      right: this.layoutBounds.right - 10,
      bottom: mvt.modelToViewY( model.floorY )
    } );
    this.addChild( resetAllButton );

    // Play/Pause and Step Forward Button Control
    this.addChild( new MASPlayPauseStepControl( model ) );

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
    this.addChild( speedControl );

    var firstSpringStopperButtonNode = new SpringStopperButtonNode( {
      listener: model.stopSpring.bind( model, 0 ),
        right: springHangerNode.springHangerNode.left - 5,
        top: topSpacing
      }
    );
    var secondSpringStopperButtonNode = new SpringStopperButtonNode( {
      listener: model.stopSpring.bind( model, 1 ),
        left: springHangerNode.springHangerNode.right + 5,
        top: topSpacing
      }
    );
    var toggleButtonsContent = [ {
      value: 'same-length',
      node: new Image( twoSpringIcon, { scale: IMAGE_SCALE } )
    }, {
      value: 'adjustable-length',
      node: new Image( halfSpringIcon, { scale: IMAGE_SCALE } )
    } ];

    var radioButtonGroup = new RadioButtonGroup( model.springLengthModeProperty, toggleButtonsContent, {
      buttonContentXMargin: 4,
      buttonContentYMargin: 4,
      top: toolboxPanel.bottom + 55,
      right: gravityControlPanel.right,
      baseColor: 'black',
      selectedStroke: 'yellow',
      deselectedStroke: 'yellow',
      selectedLineWidth: 1.3,
      deselectedLineWidth: 0.6,
      orientation: 'horizontal',
      spacing: 13
    } );
    this.addChild( radioButtonGroup );
    this.addChild( firstSpringStopperButtonNode );
    this.addChild( secondSpringStopperButtonNode );

    //Reference lines from indicator visibility box
    this.addChild( this.firstSpringEquilibriumLine );
    this.addChild( this.secondSpringEquilibriumLine );
    this.addChild( this.firstNaturalLengthLine );
    this.addChild( this.secondNaturalLengthLine );
    this.addChild( this.movableLine );
    this.addChild( this.massLayer );
    this.addChild( timerNode );
    this.addChild( rulerNode );
  }

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( ScreenView, TwoSpringView );
} );