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
  var TimeControlPanel = require( 'MASSES_AND_SPRINGS/common/view/TimeControlPanel' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var NaturalLengthLineNode = require( 'MASSES_AND_SPRINGS/common/view/NaturalLengthLineNode' );
  var Node = require( 'SCENERY/nodes/Node' );
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
  function TwoSpringView( model, tandem ) {
    this.model = model; // Make model available for reset
    var self = this;
    SpringView.call( this, model, tandem, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // Control Panel for display elements with varying visibility
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ),
      {
        top: this.spacing,
        right: this.rightPanelAlignment,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );

    model.springs[ 0 ].options.modelViewTransform2 = this.modelViewTransform;
    model.springs[ 1 ].options.modelViewTransform2 = this.modelViewTransform;

    //  TODO: put in a vbox?? hmm... wrong place for this comment??
    this.firstOscillatingSpringNode = new OscillatingSpringNode(
      model.springs[ 0 ],
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 1 ),
      tandem.createTandem( 'firstOscillatingSpringNode' )
    );
    this.secondOscillatingSpringNode = new OscillatingSpringNode(
      model.springs[ 1 ],
      MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 1 ),
      tandem.createTandem( 'secondOscillatingSpringNode' )
    );

    // Spring Hanger Node
    this.springHangerNode = new SpringHangerNode(
      model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' )
    );

    this.firstSpringStopperButtonNode = new StopperButtonNode(
      tandem.createTandem( 'firstSpringStopperButtonNode' ), {
        listener: function() {
          model.springs[ 0 ].stopSpring();
        },
        right: this.springHangerNode.left - this.spacing,
        top: this.spacing
      } );
    var secondSpringStopperButtonNode = new StopperButtonNode(
      tandem.createTandem( 'secondSpringStopperButtonNode' ), {
        listener: function() {
          model.springs[ 1 ].stopSpring();
        },
        left: this.springHangerNode.right + this.spacing,
        top: this.spacing
      } );

    // Spring Constant Control Panels
    this.firstSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 0 ].springConstantProperty,
      model.springs[ 0 ].springConstantRange,
      StringUtils.fillIn( springConstantString, { spring: 1 } ),
      tandem.createTandem( 'firstSpringConstantControlPanel' ),
      {
        right: this.springHangerNode.left - 40,
        top: this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30
      } );

    this.secondSpringConstantControlPanel = new SpringConstantControlPanel(
      model.springs[ 1 ].springConstantProperty,
      model.springs[ 1 ].springConstantRange,
      StringUtils.fillIn( springConstantString, { spring: 2 } ),
      tandem.createTandem( 'secondSpringConstantControlPanel' ),
      {
        left: secondSpringStopperButtonNode.right + this.spacing,
        top: this.spacing,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30
      } );

    // Initializes red movable reference line
    var movableLineNode = new MovableLineNode(
      this.visibleBoundsProperty.get().getCenter().minus( new Vector2( 45, 0 ) ),
      180,
      model.movableLineVisibleProperty,
      this.springHangerNode.centerX + 5,
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes equilibrium line for first spring
    var firstSpringEquilibriumLineNode = new EquilibriumLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'firstSpringEquilibriumLineNode' )
    );

    // @public Initializes equilibrium line for second spring
    var secondSpringEquilibriumLineNode = new EquilibriumLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.equilibriumPositionVisibleProperty,
      tandem.createTandem( 'secondSpringEquilibriumLineNode' )
    );

    // @public Initializes natural line for first spring
    var firstNaturalLengthLineNode = new NaturalLengthLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'firstNaturalLengthLineNode' )
    );

    // @public Initializes natural line for second spring
    var secondNaturalLengthLineNode = new NaturalLengthLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.naturalLengthVisibleProperty,
      tandem.createTandem( 'secondNaturalLengthLineNode' )
    );

    // Gravity Control Panel
    this.gravityAndFrictionControlPanel = new GravityAndFrictionControlPanel(
      model, this, tandem.createTandem( 'gravityAndFrictionControlPanel' ), {
        right: this.rightPanelAlignment,
        top: indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );

    this.toolboxPanel.top = this.gravityAndFrictionControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING;
    this.toolboxPanel.left = this.gravityAndFrictionControlPanel.left;
    this.toolboxPanel.minWidth = this.gravityAndFrictionControlPanel.width;

    this.springHangerNode.centerX = 336;

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
    this.addChild( this.timeControlPanel );
    this.addChild( this.speedControl );
    this.addChild( this.firstSpringStopperButtonNode );
    this.addChild( secondSpringStopperButtonNode );

    //Reference lines from indicator visibility box
    this.addChild( firstSpringEquilibriumLineNode );
    this.addChild( secondSpringEquilibriumLineNode );
    this.addChild( firstNaturalLengthLineNode );
    this.addChild( secondNaturalLengthLineNode );
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

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( SpringView, TwoSpringView );
} );