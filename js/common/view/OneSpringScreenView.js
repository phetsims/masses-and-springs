// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common ScreenView for using one mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  var EnergyGraphNode = require( 'MASSES_AND_SPRINGS/common/view/EnergyGraphNode' );
  var GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
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
  function OneSpringScreenView( model, tandem ) {
    SpringScreenView.call( this, model, tandem );
    var self = this;

    var springHangerNode = new SpringHangerNode( model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ),
      {
        singleSpring: true
      } );

    // Spring Constant Control Panel
    var minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT } )
    ];
    var springConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );

    // Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    var equilibriumVisibilityProperty = new DerivedProperty( [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );

    // @public {ReferenceLineNode} Initializes equilibrium line for the spring
    this.springEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.massEquilibriumYPositionProperty,
      equilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Initializes natural line for the spring
    var naturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: 'rgb( 65, 66, 232 )',
        fixedPosition: true
      }
    );

    var springStopperButtonNode = this.createStopperButton( this.model.firstSpring, tandem );
    this.model.firstSpring.buttonEnabledProperty.link(
      function( buttonEnabled ) {
        springStopperButtonNode.enabled = buttonEnabled;
      } );

    //REVIEW: JSDoc
    this.energyGraphNode = new EnergyGraphNode( model, tandem );
    //REVIEW: Could inline topLeft: this.visibleBoundsProperty.get().topLeft.plus( new Vector2( this.spacing, this.spacing ) )
    //REVIEW: Fine with this too
    this.energyGraphNode.top = this.visibleBoundsProperty.get().top + this.spacing;
    this.energyGraphNode.left = this.visibleBoundsProperty.get().left + this.spacing;

    var massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      tandem.createTandem( 'massValueControlPanel' )
    );

    // Property that determines the zero height in the view.
    var zeroHeightProperty = new Property( this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) );

    // Initializes movable line
    var xBoundsLimit = this.modelViewTransform.modelToViewX( this.model.firstSpring.positionProperty.value.x ) + this.spacing;
    var movableLineNode = new MovableLineNode(
      springHangerNode.center.plus( new Vector2( 45, 200 ) ),
      100,
      model.movableLineVisibleProperty,
      new Bounds2( xBoundsLimit, 85, xBoundsLimit, zeroHeightProperty.value ),
      tandem.createTandem( 'movableLineNode' )
    );

    // Displacement arrows added for each springs
    var displacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].spring.displacementProperty,
      model.naturalLengthVisibleProperty,
      tandem,
      { modelViewTransform: this.modelViewTransform } );
    //REVIEW: Just pass these options into the DisplacementArrowNode options? ( e.g. left: ... )
    displacementArrowNode.left = this.springNodes[ 0 ].right + 12;
    displacementArrowNode.centerY = this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].spring.bottomProperty.value );

    // Gravity Control Panel
    this.gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ),
      {
        right: this.rightPanelAlignment,
        //REVIEW: Wait, what does minWidth do? It's not a Panel, right?
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: true
      }
    );

    // Zero height reference line
    var zeroHeightLine = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      zeroHeightProperty,
      new Property( true ), {
        stroke: '#5798de',
        zeroPointLine: true
      }
    );
    zeroHeightLine.x = this.springEquilibriumLineNode.x;
    zeroHeightLine.y = zeroHeightProperty.get();
    this.addChild( zeroHeightLine );

    // Label for zero height
    var zeroHeightLabel = new Node( {
      children: [
        new HBox( {
          children: [
            new HStrut( 10 ),
            new Text( heightEqualsZeroString, {
              font: MassesAndSpringsConstants.TITLE_FONT,
              fill: zeroHeightLine.stroke
            } ) ]
        } ) ]
    } );

    this.resetAllButton.addListener( function() {
      self.model.reset();
      self.energyGraphNode.reset();
      movableLineNode.reset();
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
    this.addChild( this.timeControlPanel );
    this.addChild( springStopperButtonNode );

    // Reference lines from indicator visibility box
    this.addChild( this.springEquilibriumLineNode );
    this.addChild( naturalLengthLineNode );
    this.addChild( displacementArrowNode );
    this.addChild( movableLineNode );
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    this.addChild( this.resetAllButton );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //REVIEW: Lots of layout here. Can we use things like AlignBox/HBox/VBox to simplify? Might be worth collaboration.
      //REVIEW: How much of this can be shared with TwoSpringScreenView (and moved to SpringScreenView?)
      //REVIEW: Style guide wants one space after //
      //Update the bounds of view elements
      springHangerNode.top = self.spacing;
      movableLineNode.centerX = springHangerNode.centerX;
      massValueControlPanel.top = springHangerNode.top;
      massValueControlPanel.right = springHangerNode.left - self.spacing;
      springHangerNode.centerX = self.modelViewTransform.modelToViewX( model.firstSpring.positionProperty.value.x );
      springStopperButtonNode.left = springHangerNode.right + self.spacing;
      springConstantControlPanel.left = springStopperButtonNode.right + self.spacing;
      self.resetAllButton.right = self.panelRightSpacing;
      self.timeControlPanel.right = self.resetAllButton.left - self.spacing * 6;
      self.energyGraphNode.left = visibleBounds.left + self.spacing;
      self.timerNode.timerNodeMovableDragHandler.dragBounds = visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      );
      self.rulerNode.rulerNodeMovableDragHandler.dragBounds = visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      );
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

  massesAndSprings.register( 'OneSpringScreenView', OneSpringScreenView );

  return inherit( SpringScreenView, OneSpringScreenView, {
    /**
     * @public
     */
    reset: function() {
      MassesAndSpringsModel.prototype.reset.call( this );
      this.energyGraphNode.reset();
    },
    /**
     * Responsible for updating the energy bar graph
     *
     * @public
     */
    step: function() {
      this.energyGraphNode.update();
    }
  } );
} );