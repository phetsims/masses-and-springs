// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common ScreenView for  using one mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  var EnergyGraphNode = require( 'MASSES_AND_SPRINGS/common/view/EnergyGraphNode' );
  var GravityAndDampingControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlPanel' );
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var MassValueControlPanel = require( 'MASSES_AND_SPRINGS/common/view/MassValueControlPanel' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  var SpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/SpringScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var heightEqualsZeroString = require( 'string!MASSES_AND_SPRINGS/heightEqualsZero' );
  var largeString = require( 'string!MASSES_AND_SPRINGS/large' );
  var smallString = require( 'string!MASSES_AND_SPRINGS/small' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function OneSpringView( model, tandem ) {
    this.model = model; // Make model available
    SpringScreenView.call( this, model, tandem );
    var self = this;

    var springHangerNode = new SpringHangerNode( model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ),
      {
        singleSpring: true
      } );

    // Control Panel for display elements with varying visibility
    this.indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // Spring Constant Control Panel
    var minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT } )
    ];
    var springConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );

    // @public Initializes equilibrium line for the spring
    var springEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.springs[ 0 ].massEquilibriumYPositionProperty,
      model.equilibriumPositionVisibleProperty, {
        stroke: 'black'
      }
    );

    // @public Initializes natural line for the spring
    var naturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.springs[ 0 ].bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: 'rgb( 65, 66, 232 )',
        fixedPosition: true
      }
    );

    var springStopperButtonNode = this.createStopperButton( this.model.springs[ 0 ], tandem );
    springStopperButtonNode.left = springHangerNode.right + this.spacing;
    this.model.springs[ 0 ].buttonEnabledProperty.link(
      function( buttonEnabled ) {
        springStopperButtonNode.enabled = buttonEnabled;
      } );

    this.energyGraphNode = new EnergyGraphNode( model, tandem );
    this.energyGraphNode.top = this.visibleBoundsProperty.get().top + this.spacing;
    this.energyGraphNode.left = this.visibleBoundsProperty.get().left + this.spacing;

    var massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      tandem.createTandem( 'massValueControlPanel' )
    );

    // Initializes movable line
    var xBoundsLimit = this.modelViewTransform.modelToViewX( this.model.springs[ 0 ].positionProperty.value.x ) + this.spacing;
    var movableLineNode = new MovableLineNode(
      springHangerNode.center.plus( new Vector2( 45, 200 ) ),
      100,
      model.movableLineVisibleProperty,
      new Bounds2( xBoundsLimit, 85, xBoundsLimit, 600 ),
      tandem.createTandem( 'movableLineNode' )
    );

    // Displacement arrows added for each springs
    var displacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].spring.displacementProperty,
      model.displacementVisibleProperty,
      tandem,
      { modelViewTransform: this.modelViewTransform } );
    displacementArrowNode.left = this.springNodes[ 0 ].right + 12;
    displacementArrowNode.top = this.springNodes[ 0 ].bottom - 12;
    this.addChild( displacementArrowNode );

    // Gravity Control Panel
    this.gravityAndDampingControlPanel = new GravityAndDampingControlPanel(
      model, this, tandem.createTandem( 'gravityAndDampingControlPanel' ),
      {
        right: this.rightPanelAlignment,
        top: this.indicatorVisibilityControlPanel.bottom + MassesAndSpringsConstants.PANEL_VERTICAL_SPACING,
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: true
      }
    );

    // Zero height reference line
    var zeroHeightProperty = new Property( this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) );
    var zeroHeightLine = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      zeroHeightProperty,
      new Property( true ), {
        stroke: '#5798de',
        zeroPointLine: true
      }
    );
    zeroHeightLine.x = springEquilibriumLineNode.x;
    zeroHeightLine.y = zeroHeightProperty.get();
    this.addChild( zeroHeightLine );

    // Label for zero height
    var zeroHeightLabel = new Node( {
      children: [
        new Text( heightEqualsZeroString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          fill: zeroHeightLine.stroke
        } )
      ]
    } );

    this.resetAllButton.addListener( function() {
      self.model.reset();
      self.energyGraphNode.reset();
    } );

    zeroHeightLabel.center = zeroHeightLine.center;
    zeroHeightLabel.x = zeroHeightLine.x + (zeroHeightLine.width);
    this.addChild( zeroHeightLabel );

    this.shelf.rectWidth = 140;
    this.shelf.centerX = this.modelViewTransform.modelToViewX( model.masses[ 0 ].positionProperty.value.x );

    // Adding all of the nodes to the scene graph
    // Adding Panels to scene graph
    this.addChild( springHangerNode );
    this.addChild( massValueControlPanel );
    this.addChild( springConstantControlPanel );
    this.addChild( this.energyGraphNode );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( this.timeControlPanel );
    this.addChild( springStopperButtonNode );

    // Reference lines from indicator visibility box
    this.addChild( springEquilibriumLineNode );
    this.addChild( naturalLengthLineNode );
    this.addChild( movableLineNode );
    this.addChild( this.massLayer );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //Update the bounds of view elements
      springHangerNode.top = self.spacing;
      movableLineNode.centerX = springHangerNode.centerX;
      massValueControlPanel.top = springHangerNode.top;
      massValueControlPanel.right = springHangerNode.left - self.spacing;
      springHangerNode.centerX = self.modelViewTransform.modelToViewX( model.springs[ 0 ].positionProperty.value.x );
      springStopperButtonNode.left = springHangerNode.right + self.spacing;
      springConstantControlPanel.left = springStopperButtonNode.right + self.spacing;
      self.resetAllButton.right = self.panelRightSpacing;
      self.timeControlPanel.right = self.resetAllButton.left - self.spacing * 6;
      self.energyGraphNode.left = visibleBounds.left + self.spacing;
      self.timerNode.updateBounds( visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      ) );
      self.rulerNode.updateBounds( visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      ) );
      self.massNodes.forEach( function( massNode ) {
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

  return inherit( SpringScreenView, OneSpringView, {
    /**
     * TODO: add documentation
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
      this.energyGraphNode.reset();
    },
    /**
     * TODO: add documentation
     */
    step: function( dt ) {
      this.energyGraphNode.update();
    }
  } );
} );