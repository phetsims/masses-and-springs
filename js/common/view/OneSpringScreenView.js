// Copyright 2016-2020, University of Colorado Boulder

/**
 * Common ScreenView for using one mass.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );
  const EnergyGraphNode = require( 'MASSES_AND_SPRINGS/common/view/EnergyGraphNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const MassesAndSpringsModel = require( 'MASSES_AND_SPRINGS/common/model/MassesAndSpringsModel' );
  const MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  const MassValueControlPanel = require( 'MASSES_AND_SPRINGS/common/view/MassValueControlPanel' );
  const MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  const Property = require( 'AXON/Property' );
  const ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  const SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  const SpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/SpringScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const heightEqualsZeroString = require( 'string!MASSES_AND_SPRINGS/heightEqualsZero' );
  const largeString = require( 'string!MASSES_AND_SPRINGS/large' );
  const smallString = require( 'string!MASSES_AND_SPRINGS/small' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function OneSpringScreenView( model, tandem, options ) {
    SpringScreenView.call( this, model, tandem, options );
    const self = this;

    // @public {number} centerX of the spring in view coordinates
    this.springCenter = self.modelViewTransform.modelToViewX( model.firstSpring.positionProperty.value.x );

    // Spring Constant Control Panel
    const minMaxLabels = [
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

    const massValueControlPanel = new MassValueControlPanel(
      model.masses[ 0 ],
      this.massNodeIcon,
      tandem.createTandem( 'massValueControlPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 8,
        yMargin: 5
      } );

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
    const naturalLengthLineNode = new ReferenceLineNode(
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
    const zeroHeightProperty = new Property( this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) );

    // Initializes movable line
    const xBoundsLimit = this.springCenter + this.spacing * 1.1;
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
      const zeroHeightLine = new ReferenceLineNode(
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
      self.adjustViewComponents( true, visibleBounds );
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