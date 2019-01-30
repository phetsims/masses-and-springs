// Copyright 2016-2019, University of Colorado Boulder

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
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var MassValueControlPanel = require( 'MASSES_AND_SPRINGS/common/view/MassValueControlPanel' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
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
   * @param {Object} [options]
   * @constructor
   */
  function OneSpringScreenView( model, tandem, options ) {
    SpringScreenView.call( this, model, tandem, options );
    var self = this;

    // @public {number} centerX of the spring in view coordinates
    this.springCenter = self.modelViewTransform.modelToViewX( model.firstSpring.positionProperty.value.x );

    // Spring Constant Control Panel
    var minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 60 } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 60 } )
    ];

    // @public {Property.<boolean>} Equilibrium of mass is dependent on the mass being attached and the visibility of the equilibrium line.
    this.equilibriumVisibilityProperty = new DerivedProperty(
      [ model.equilibriumPositionVisibleProperty, model.firstSpring.massAttachedProperty ],
      function( equilibriumPositionVisible, massAttached ) {
        if ( massAttached ) {
          return equilibriumPositionVisible;
        }
        else {
          return false;
        }
      } );

    // @public {MassNode} Icon used in massValueControlPanel in both Basics and non-Basics version
    this.massNodeIcon = new MassNode(
      new Mass( 0.0055, 0, MassesAndSpringsColorProfile.adjustableMassProperty, model.gravityProperty, tandem, { icon: true } ),
      this.modelViewTransform,
      this.visibleBoundsProperty,
      model,
      tandem.createTandem( 'massIcon' ) );

    var massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      this.massNodeIcon,
      tandem.createTandem( 'massValueControlPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 8,
        yMargin: 5
      }
    );

    this.springHangerNode = new SpringHangerNode( model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ),
      {
        singleSpring: true
      } );
    this.springStopperButtonNode = this.createStopperButton( this.model.firstSpring, tandem );

    // @public {SpringControlPanel} Accessed in Basics version
    this.springConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );

    // @public {ReferenceLineNode} Initializes equilibrium line for an attached mass
    this.massEquilibriumLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.massEquilibriumYPositionProperty,
      this.equilibriumVisibilityProperty, {
        stroke: 'black'
      }
    );

    // Initializes natural line for the spring
    var naturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: MassesAndSpringsColorProfile.unstretchedLengthProperty, // Naming convention pulled from basics version.
        fixedPosition: true
      }
    );

    this.model.firstSpring.buttonEnabledProperty.link(
      function( buttonEnabled ) {
        self.springStopperButtonNode.enabled = buttonEnabled;
      } );

    if ( !model.basicsVersion ) {
      // @public {EnergyGraphNode} energy graph that displays energy values for the spring system.
      this.energyGraphNode = new EnergyGraphNode( model, tandem );
      this.addChild( this.energyGraphNode );
    }

    // Property that determines the zero height in the view.
    var zeroHeightProperty = new Property( this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) );

    // Initializes movable line
    var xBoundsLimit = this.springCenter + this.spacing * 1.1;
    this.movableLineNode = new MovableLineNode(
      this.springHangerNode.center.plus( new Vector2( 45, 200 ) ),
      100,
      model.movableLineVisibleProperty,
      new Bounds2( xBoundsLimit, 85, xBoundsLimit, zeroHeightProperty.value ),
      tandem.createTandem( 'movableLineNode' )
    );

    // Masses and Springs:Basics should not include a zero height reference line
    if ( !model.basicsVersion ) {

      // Displacement arrows added for each springs
      var displacementArrowNode = new DisplacementArrowNode(
        this.springNodes[ 0 ].nodeProperty.value.spring.displacementProperty,
        model.naturalLengthVisibleProperty,
        tandem,
        {
          modelViewTransform: this.modelViewTransform,
          left: this.springNodes[ 0 ].nodeProperty.value.right + 12,
          centerY: this.modelViewTransform.modelToViewY( this.springNodes[ 0 ].nodeProperty.value.spring.bottomProperty.value )
        } );

      // Zero height reference line
      var zeroHeightLine = new ReferenceLineNode(
        this.modelViewTransform,
        model.firstSpring,
        zeroHeightProperty,
        new Property( true ), {
          stroke: '#5798de',
          zeroPointLine: true,
          label: new Text( heightEqualsZeroString, {
            font: MassesAndSpringsConstants.TITLE_FONT,
            fill: '#5798de',
            maxWidth: 125
          } )
        } );

      zeroHeightLine.x = this.massEquilibriumLineNode.x;
      zeroHeightLine.y = zeroHeightProperty.get();
      this.addChild( zeroHeightLine );

      this.resetAllButton.addListener( function() {
        self.model.reset();
        self.movableLineNode.reset();
        self.energyGraphNode && self.energyGraphNode.reset();
      } );
    }

    // @public {HBox} Contains Panels/Nodes that hover near the spring system at the center of the screen.
    this.springSystemControlsNode = new HBox( {
      children: [
        massValueControlPanel,
        this.springHangerNode,
        this.springStopperButtonNode
      ],
      spacing: this.spacing * 1.4,
      align: 'top'
    } );

    // Adding system controls and energy graph to scene graph
    this.addChild( this.springSystemControlsNode );
    this.addChild( this.springConstantControlPanel );

    // Reference lines from indicator visibility box
    if ( !model.basicsVersion ) {
      this.addChild( this.massEquilibriumLineNode );
    }

    this.addChild( naturalLengthLineNode );

    // This is handled here to maintain line node layering order
    if ( !model.basicsVersion ) {
      this.addChild( displacementArrowNode );
    }
    this.addChild( this.movableLineNode );

    // Adding layers for draggable objects
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      self.panelRightSpacing = visibleBounds.right - self.spacing;

      // Alignment of layout
      self.springSystemControlsNode.centerX = self.springCenter * 0.855; // centering springHangerNode over spring
      self.springSystemControlsNode.top = self.spacing;
      self.springConstantControlPanel.top = self.springSystemControlsNode.top;
      self.springConstantControlPanel.left = self.springSystemControlsNode.right + self.spacing;
      self.springSystemControlsNode.top = self.spacing;
      self.simControlHBox.rightBottom = new Vector2( self.panelRightSpacing, self.shelf.bottom );
      self.movableLineNode.centerX = self.springCenter;

      if ( !model.basicsVersion ) {
        self.energyGraphNode.leftTop = new Vector2( visibleBounds.left + self.spacing, self.springSystemControlsNode.top );
      }

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
            new Vector2(
              self.modelViewTransform.viewToModelX( visibleBounds.maxX ),
              massNode.mass.positionProperty.get().y
            )
          );
        }
        if ( massNode.centerX < visibleBounds.minX ) {
          massNode.mass.positionProperty.set(
            new Vector2(
              self.modelViewTransform.viewToModelX( visibleBounds.minX ),
              massNode.mass.positionProperty.get().y
            )
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