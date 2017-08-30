// Copyright 2017, University of Colorado Boulder

/**
 * Common ScreenView for  using one mass.
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
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var NaturalLengthLineNode = require( 'MASSES_AND_SPRINGS/common/view/NaturalLengthLineNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MassValueControlPanel = require( 'MASSES_AND_SPRINGS/common/view/MassValueControlPanel' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpringView = require( 'MASSES_AND_SPRINGS/common/view/SpringView' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  var SpringConstantControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringConstantControlPanel' );
  var StopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/StopperButtonNode' );
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
    SpringView.call( this, model, tandem, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    var oscillatingSpringNode = new OscillatingSpringNode(
      model.springs[ 0 ],
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 1 ),
      tandem.createTandem( 'oscillatingSpringNode' )
    );

    var springHangerNode = new SpringHangerNode( model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ),
      {
        singleSpring: true
      } );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ), {
        top: this.spacing,
        right: this.rightPanelAlignment,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );

    // Spring Constant Control Panel
    var springConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.fillIn( springConstantString, { spring: 2 } ),
      tandem.createTandem( 'springConstantControlPanel' ), {
        right: indicatorVisibilityControlPanel.left - this.spacing,
        top: this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30
      }
    );
    springHangerNode.top = springConstantControlPanel.top;

    // @public Initializes equilibrium line for the spring
    var springEquilibriumLineNode = new EquilibriumLineNode(
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 0.98 ),
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'springEquilibriumLineNode' )
    );

    // @public Initializes natural line for the spring
    var naturalLengthLineNode = new NaturalLengthLineNode(
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 0.98 ),
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'naturalLengthLineNode' )
    );

    // Gravity Control Panel
    this.gravityAndFrictionControlPanel = new GravityAndFrictionControlPanel(
      model, this, tandem.createTandem( 'gravityAndFrictionControlPanel' ),
      {
        right: this.rightPanelAlignment,
        top: indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        frictionVisible: true
      }
    );


    var springStopperButtonNode = new StopperButtonNode(
      tandem.createTandem( 'springStopperButtonNode' ), {
        listener: function() {
          model.springs[ 0 ].stopSpring();
        },
        right: springConstantControlPanel.left - this.spacing,
        top: this.spacing
      }
    );

    var energyGraphNode = new EnergyGraphNode( model, tandem );
    energyGraphNode.top = this.visibleBoundsProperty.get().top + this.spacing;
    energyGraphNode.left = this.visibleBoundsProperty.get().left + this.spacing;

    var massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      tandem.createTandem( 'massValueControlPanel' )
    );
    massValueControlPanel.top = this.visibleBoundsProperty.get().getMinY() + this.spacing;
    massValueControlPanel.left = energyGraphNode.right + this.spacing;
    springHangerNode.right = springStopperButtonNode.left - this.spacing;

    // Initializes movable line
    var movableLineNode = new MovableLineNode(
      springHangerNode.getCenter().plus( new Vector2( 45, 200 ) ),
      100,
      model.movableLineVisibleProperty,
      springHangerNode.centerX + 5,
      tandem.createTandem( 'movableLineNode' )
    );

    //TODO: Make this an array. this.children = [] and add this as an option object. Follow Griddle VerticalBarChart as example.
    // Adding all of the nodes to the scene graph
    this.addChild( oscillatingSpringNode );

    // Adding Panels to scene graph
    this.addChild( springHangerNode );
    this.addChild( massValueControlPanel );
    this.addChild( springConstantControlPanel );
    this.addChild( indicatorVisibilityControlPanel );
    this.addChild( this.gravityAndFrictionControlPanel );
    this.addChild( this.toolboxPanel );
    this.addChild( energyGraphNode );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( this.timeControlPanel );
    this.addChild( this.speedControl );
    this.addChild( springStopperButtonNode );

    // Reference lines from indicator visibility box
    this.addChild( springEquilibriumLineNode );
    this.addChild( naturalLengthLineNode );
    this.addChild( movableLineNode );
    this.addChild( this.massLayer );

    // Adding Nodes in tool box
    this.addChild( this.timerNode );
    this.addChild( this.rulerNode );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //Update the bounds of view elements
      indicatorVisibilityControlPanel.right = visibleBounds.right - self.spacing;
      self.gravityAndFrictionControlPanel.right = visibleBounds.right - self.spacing;
      self.toolboxPanel.right = visibleBounds.right - self.spacing;
      self.resetAllButton.right = visibleBounds.right - self.spacing;
      self.speedControl.right = self.resetAllButton.left - self.spacing * 6;
      self.timeControlPanel.right = self.speedControl.left - self.spacing * 6;
      self.toolboxPanel.dragBounds = 3;
      energyGraphNode.left = visibleBounds.left + self.spacing;
      self.timerNode.updateBounds( visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      ) );
      self.rulerNode.updateBounds( visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      ) );
      self.massNodes.forEach( function( massNode ) {
        massNode.movableDragHandler.dragBounds = self.modelViewTransform.viewToModelBounds( visibleBounds );

        if ( massNode.centerX > visibleBounds.maxX ) {
          massNode.mass.positionProperty.set(
            new Vector2( self.modelViewTransform.viewToModelX( visibleBounds.maxX ), massNode.mass.positionProperty.get().y )
          );
        }
        if ( massNode.centerX < visibleBounds.minX ) {
          massNode.mass.positionProperty.set(
            new Vector2( self.modelViewTransform.viewToModelX( visibleBounds.minX ), massNode.mass.positionProperty.get().y )
          );
        }
      } );
    } );
  }

  massesAndSprings.register( 'OneSpringView', OneSpringView );

  return inherit( SpringView, OneSpringView );
} );