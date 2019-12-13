// Copyright 2017-2019, University of Colorado Boulder

/**
 * Common ScreenView used for both singular and multispring screen view.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const ClosestDragListener = require( 'SUN/ClosestDragListener' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const DraggableRulerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableRulerNode' );
  const DraggableTimerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableTimerNode' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const IndicatorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const MutableOptionsNode = require( 'SUN/MutableOptionsNode' );
  const Node = require( 'SCENERY/nodes/Node' );
  const OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  const PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  const Panel = require( 'SUN/Panel' );
  const Plane = require( 'SCENERY/nodes/Plane' );
  const Property = require( 'AXON/Property' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const ShelfNode = require( 'MASSES_AND_SPRINGS/common/view/ShelfNode' );
  const SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  const StopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/StopperButtonNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  const ToolboxPanel = require( 'MASSES_AND_SPRINGS/common/view/ToolboxPanel' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const springConstantPatternString = require( 'string!MASSES_AND_SPRINGS/springConstantPattern' );
  const springStrengthString = require( 'string!MASSES_AND_SPRINGS/springStrength' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function SpringScreenView( model, tandem, options ) {
    ScreenView.call( this );

    options = merge( {
      useSliderLabels: true,
      dampingVisible: false
    }, options );

    const self = this;

    // @public {Plane} Support for expanding touchAreas near massNodes.
    this.backgroundDragPlane = new Plane();
    const closestDragListener = new ClosestDragListener( 30, 0 );

    this.backgroundDragPlane.addInputListener( closestDragListener );


    // @public {MassesAndSpringsModel}
    this.model = model;

    const viewOrigin = new Vector2( 0, this.visibleBoundsProperty.get().height * ( 1 - MassesAndSpringsConstants.SHELF_HEIGHT ) );

    // @public {ModelViewTransform2}
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, viewOrigin, 397 );

    // @public {PaintColorProperty} Colors for OscillatingSpringNode
    this.springFrontColorProperty = new PaintColorProperty( 'lightGray' );
    this.springMiddleColorProperty = new PaintColorProperty( 'gray' );
    this.springBackColorProperty = new PaintColorProperty( 'black' );

    // @private {Array.<MutableOptionsNode>} Used to reference the created springs in the view.
    this.springNodes = model.springs.map( function( spring ) {
      const springNode = new MutableOptionsNode( OscillatingSpringNode,
        [ spring, self.modelViewTransform, tandem.createTandem( 'oscillatingSpringNode' ) ],
        { leftEndLength: -10 },
        {
          frontColor: self.springFrontColorProperty,
          middleColor: self.springMiddleColorProperty,
          backColor: self.springBackColorProperty
        } );
      self.addChild( springNode );
      return springNode;
    } );

    // @protected {number} - Spacing used for the margin of layout bounds
    this.spacing = 10;

    // @public {Node} Specific layer for massNodes. Used for setting layering order of massNodes.
    this.massLayer = new Node( { tandem: tandem.createTandem( 'massLayer' ), preventFit: true } );

    // @public {Array.<Node>}
    this.massNodes = [];

    this.massNodes = model.masses.map( function( mass ) {
      const massNode = new MassNode(
        mass,
        self.modelViewTransform,
        self.visibleBoundsProperty,
        model,
        tandem.createTandem( mass.massTandem.name + 'Node' ) );
      self.massLayer.addChild( massNode );

      // If the mass is on the shelf reset the mass layers.
      mass.onShelfProperty.lazyLink( function( onShelf ) {
        if ( onShelf ) {
          self.resetMassLayer();
        }
      } );
      closestDragListener.addDraggableItem( {
        startDrag: massNode.movableDragHandler.startDrag.bind( massNode.movableDragHandler ),

        // globalPoint is the position of our pointer.
        computeDistance: function( globalPoint ) {

          // The mass position is recognized as being really far away.
          if ( mass.userControlledProperty.value ) {
            return Number.POSITIVE_INFINITY;
          }
          else {
            const cursorViewPosition = self.globalToLocalPoint( globalPoint );
            const massRectBounds = massNode.localToParentBounds( massNode.rect.bounds );
            const massHookBounds = massNode.localToParentBounds( massNode.hookNode.bounds );

            return Math.sqrt( Math.min(
              massRectBounds.minimumDistanceToPointSquared( cursorViewPosition ),
              massHookBounds.minimumDistanceToPointSquared( cursorViewPosition )
            ) );
          }
        }
      } );


      // Keeps track of the mass node to restore original Z order.
      return massNode;
    } );

    // @public {Shelf} Add shelf for to house massNodes
    this.shelf = new ShelfNode( tandem, {
      rectHeight: 7
    } );
    this.shelf.rectY = this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) - this.shelf.rectHeight;

    if ( !model.basicsVersion ) {
      this.addChild( this.shelf );
    }

    // @public {GravityAndDampingControlNode} Gravity Control Panel
    this.gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 25,
        dampingVisible: options.dampingVisible,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        useSliderLabels: options.useSliderLabels
      } );

    // @public {DraggableTimerNode}
    this.timerNode = new DraggableTimerNode(
      this.visibleBoundsProperty.get(),
      Vector2.ZERO,
      model.timerSecondsProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty,
      function() {

        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( self.toolboxPanel.getGlobalBounds().intersectsBounds( self.timerNode.getGlobalBounds() ) ) {
          model.timerVisibleProperty.set( false );
          model.timerSecondsProperty.reset();
          model.timerRunningProperty.reset();
        }
      },
      tandem.createTandem( 'timerNode' )
    );

    // @public {DraggableRulerNode}
    this.rulerNode = new DraggableRulerNode(
      this.modelViewTransform,
      this.visibleBoundsProperty.get(),
      Vector2.ZERO,
      model.rulerVisibleProperty,
      function() {

        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( self.toolboxPanel.getGlobalBounds().intersectsBounds( self.rulerNode.getGlobalBounds() ) ) {
          model.rulerVisibleProperty.set( false );
        }
      },
      tandem.createTandem( 'rulerNode' )
    );

    // @public {Node} Create specific layer for tools so they don't overlap the reset all button.
    this.toolsLayer = new Node( {
      children: [ this.timerNode, this.rulerNode ],
      tandem: tandem.createTandem( 'massLayer' ),
      preventFit: true
    } );

    // @public {ResetAllButton} Reset All button
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();

        // Done to preserve layering order to initial state. Prevents masses from stacking over each other.
        self.resetMassLayer();
      },
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // @public {TimeControlNode} Sim speed controls
    this.timeControlNode = new TimeControlNode( model.playingProperty, {
      isSlowMotionProperty: new DynamicProperty( new Property( model.simSpeedProperty ), {
        map: function( simSpeed ) {
          return simSpeed === model.simSpeedChoice.SLOW;
        },
        inverseMap: function( isSlow ) {
          return isSlow ? model.simSpeedChoice.SLOW : model.simSpeedChoice.NORMAL;
        },
        bidirectional: true
      } ),
      stepForwardOptions: {
        listener: function() { model.stepForward( 0.01 ); }
      },
      tandem: tandem.createTandem( 'timeControlNode' )
    } );

    // @public {AlignGroup}
    this.rightPanelAlignGroup = new AlignGroup( { matchVertical: false } );

    // @public {ToolboxPanel} Toolbox Panel
    this.toolboxPanel = new ToolboxPanel(
      this.visibleBoundsProperty.get(),
      this.rulerNode,
      this.timerNode,
      model.rulerVisibleProperty,
      model.timerVisibleProperty,
      this.rightPanelAlignGroup,
      tandem.createTandem( 'toolboxPanel' ), {
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 32
      }
    );

    // @public {HBox} Buttons controlling the speed of the sim, play/pause button, and the reset button
    this.simControlHBox = new HBox( {
      spacing: this.spacing * 6,
      children: [ this.timeControlNode, this.resetAllButton ]
    } );
    this.addChild( this.simControlHBox );

    // @protected {Node} Layer that gets moved to the back of the scene graph to handle z-ordering of subtypes.
    this.backLayer = new Node();
    this.addChild( this.backLayer );
    this.backLayer.moveToBack();

  }

  massesAndSprings.register( 'SpringScreenView', SpringScreenView );

  return inherit( ScreenView, SpringScreenView, {

    /**
     * Helper function to restore initial layering of the masses to prevent them from stacking over each other.
     * @public
     */
    resetMassLayer: function() {
      this.massNodes.forEach( function( massNode ) {
        massNode.moveToFront();
      } );
    },

    /**
     * Creates a stopper button that stops the oscillation of its referenced spring.
     * @public
     *
     * @param {Spring} spring
     * @param {Tandem} tandem
     * @returns {StopperButtonNode}
     */
    createStopperButton: function( spring, tandem ) {
      return new StopperButtonNode(
        tandem.createTandem( 'secondSpringStopperButtonNode' ), {
          listener: function() {
            spring.stopSpring();
          },
          top: this.spacing
        } );
    },

    /**
     * Creates a panel that controls the designated spring's spring constant value.
     * @public
     *
     * @param {number} springIndex
     * @param {Array.<Text>} labels
     * @param {Tandem} tandem
     * @param {object} options
     *
     * @returns {SpringControlPanel}
     */
    createSpringConstantPanel: function( springIndex, labels, tandem, options ) {

      // Additional options for compatibility with Masses and Springs: Basics
      options = merge( {
        string: this.model.basicsVersion ? springStrengthString : springConstantPatternString,
        sliderTrackSize: this.model.basicsVersion ? new Dimension2( 140, 0.1 ) : new Dimension2( 120, 0.1 ),
        yMargin: this.model.basicsVersion ? 7 : 5,
        spacing: this.model.basicsVersion ? 5 : 3,
        tickLabelSpacing: this.model.basicsVersion ? 7 : 6
      }, options );

      return new SpringControlPanel(
        this.model.springs[ springIndex ].springConstantProperty,
        MassesAndSpringsConstants.SPRING_CONSTANT_RANGE,
        StringUtils.fillIn( options.string, { spring: springIndex + 1, maxWidth: 40 } ),
        labels,
        tandem.createTandem( 'firstSpringConstantControlPanel' ),
        {
          top: this.spacing,
          visible: true,
          fill: 'white',
          stroke: 'gray',
          spacing: options.spacing,
          yMargin: options.yMargin,
          sliderTrackSize: options.sliderTrackSize,
          tickLabelSpacing: options.tickLabelSpacing,
          constrainValue: function( value ) {
            return +Util.toFixed( value, 0 );
          }
        }
      );
    },

    /**
     * Creates a panel that displays visible indicators for reference lines, displacement arrow, and period trace.
     * @public
     *
     * @param {MassesAndSpringsModel} model
     * @param {Boolean} displayPeriodTrace
     * @param {Tandem} tandem
     * @returns {IndicatorVisibilityControlNode}
     */
    createIndicatorVisibilityPanel: function( model, displayPeriodTrace, tandem ) {
      return new IndicatorVisibilityControlNode(
        model,
        tandem.createTandem( 'indicatorVisibilityControlNode' ), {
          periodTraceOption: displayPeriodTrace
        } );
    },

    /**
     * Creates a panel that displays all of the right hand panels on the screen.
     * @public
     *
     * @param {Node} optionsContent
     * @param {AlignGroup} alignGroup
     * @param {Tandem } tandem
     * @returns {Panel}
     */
    createOptionsPanel: function( optionsContent, alignGroup, tandem ) {
      const optionsContentAlignBox = new AlignBox( optionsContent, { group: alignGroup } );
      const optionsPanel = new Panel(
        optionsContentAlignBox, {
          xMargin: 10,
          fill: MassesAndSpringsConstants.PANEL_FILL,
          align: 'center',
          cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
          tandem: tandem.createTandem( 'optionsPanel' ),
          minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 30
        } );
      optionsPanel.moveToBack();
      return optionsPanel;
    }
  } );
} );