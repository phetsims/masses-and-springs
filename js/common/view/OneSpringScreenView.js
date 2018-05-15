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
  var inherit = require( 'PHET_CORE/inherit' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var MassValueControlPanel = require( 'MASSES_AND_SPRINGS/common/view/MassValueControlPanel' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
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

    // {Number} centerX of the spring in view cordinates
    var springCenter = self.modelViewTransform.modelToViewX( model.firstSpring.positionProperty.value.x );

    // Spring Constant Control Panel
    var minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 40 } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 40 } )
    ];

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

    // Icon used in massValueControlPanel
    var massNodeIcon = new MassNode(
      new Mass( 0.0055, 0, model.masses[ 0 ].color, model.gravityProperty, tandem, { icon: true } ),
      this.modelViewTransform,
      this.visibleBoundsProperty,
      model,
      tandem.createTandem( 'massIcon' ) );

    var massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      massNodeIcon,
      tandem.createTandem( 'massValueControlPanel' )
    );

    var springHangerNode = new SpringHangerNode( model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ),
      {
        singleSpring: true
      } );
    var springStopperButtonNode = this.createStopperButton( this.model.firstSpring, tandem );
    var springConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );

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

    this.model.firstSpring.buttonEnabledProperty.link(
      function( buttonEnabled ) {
        springStopperButtonNode.enabled = buttonEnabled;
      } );

    // @public {EnergyGraphNode} energy graph that displays energy values for the spring system.
    this.energyGraphNode = new EnergyGraphNode( model, tandem );

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
      {
        modelViewTransform: this.modelViewTransform,
        left: this.springNodes[ 0 ].right + 12,
        centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].spring.bottomProperty.value )
      } );

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
    var zeroHeightLabel = new HBox( {
      children: [
        new Text( heightEqualsZeroString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          fill: zeroHeightLine.stroke
        } ) ]
    } );

    this.resetAllButton.addListener( function() {
      self.model.reset();
      self.energyGraphNode.reset();
      movableLineNode.reset();
    } );

    zeroHeightLabel.center = zeroHeightLine.center;
    zeroHeightLabel.x = zeroHeightLine.x + (zeroHeightLine.width + 10);
    this.addChild( zeroHeightLabel );

    this.shelf.rectWidth = 140;
    this.shelf.centerX = this.modelViewTransform.modelToViewX( model.masses[ 0 ].positionProperty.value.x );

    // Contains Panels/Nodes that hover near the spring system at the center of the screen.
    var springSystemControlsNode = new HBox( {
      children: [
        massValueControlPanel,
        springHangerNode,
        springStopperButtonNode,
        springConstantControlPanel
      ],
      spacing: this.spacing,
      align: 'top'
    } );

    // Adding Buttons to scene graph
    this.addChild( springSystemControlsNode );
    this.addChild( this.energyGraphNode );

    // Reference lines from indicator visibility box
    this.addChild( this.springEquilibriumLineNode );
    this.addChild( naturalLengthLineNode );
    this.addChild( displacementArrowNode );
    this.addChild( movableLineNode );

    // Adding layers for draggable objects
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //REVIEW: Lots of layout here. Can we use things like AlignBox/HBox/VBox to simplify? Might be worth collaboration.
      //REVIEW: How much of this can be shared with TwoSpringScreenView (and moved to SpringScreenView?)
      self.panelRightSpacing = visibleBounds.right - self.spacing;

      // Alignment of layout
      self.energyGraphNode.leftTop = visibleBounds.leftTop.plus( new Vector2( self.spacing, self.spacing ) );
      springSystemControlsNode.centerX = springCenter + self.spacing;
      springSystemControlsNode.top = visibleBounds.top + self.spacing;
      self.simControlHBox.rightBottom = visibleBounds.rightBottom.minus( new Vector2( self.spacing, self.spacing ) );
      movableLineNode.centerX = springCenter;

      // Adjusting drag bounds of draggable objects based on visible bounds.
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