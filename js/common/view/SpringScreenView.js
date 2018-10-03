// Copyright 2017-2018, University of Colorado Boulder

/**
 * Common ScreenView used for both singular and multispring screen view.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var ClosestDragListener = require( 'SUN/ClosestDragListener' );
  var DynamicProperty = require( 'AXON/DynamicProperty' );
  var DraggableRulerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableRulerNode' );
  var DraggableTimerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableTimerNode' );
  var GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IndicatorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlNode' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Panel = require( 'SUN/Panel' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shelf = require( 'MASSES_AND_SPRINGS/common/view/Shelf' );
  var SimSpeedChoice = require( 'MASSES_AND_SPRINGS/common/enum/SimSpeedChoice' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/StopperButtonNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TimeControlNode = require( 'SCENERY_PHET/TimeControlNode' );
  var ToolboxPanel = require( 'MASSES_AND_SPRINGS/common/view/ToolboxPanel' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var springStiffnessString = require( 'string!MASSES_AND_SPRINGS/springStiffness' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function SpringScreenView( model, tandem, options ) {
    ScreenView.call( this );

    options = _.extend( {
      useSliderLabels: true,
      dampingVisible: false
    }, options );

    var self = this;

    // Support for expanding touchAreas near massNodes.
    this.backgroundDragNode = new Plane();
    var closestDragListener = new ClosestDragListener( 30, 0 );

    this.addInputListener( closestDragListener );
    this.addChild( this.backgroundDragNode );

    // @public {MassesAndSpringsModel}
    this.model = model;

    var viewOrigin = new Vector2( 0, this.visibleBoundsProperty.get().height * (1 - MassesAndSpringsConstants.SHELF_HEIGHT) );

    // @public {ModelViewTransform2}
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, viewOrigin, 397 );

    // @protected {Array.<OscillatingSpringNode>} Used to reference the created springs in the view.
    this.springNodes = [];
    self.springNodes = model.springs.map( function( spring ) {
      var springNode = new OscillatingSpringNode(
        spring,
        self.modelViewTransform,
        tandem.createTandem( 'firstOscillatingSpringNode' ), {
          leftEndLength: -10
        }
      );
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
      var massNode = new MassNode(
        mass,
        self.modelViewTransform,
        self.visibleBoundsProperty,
        model,
        tandem.createTandem( mass.massTandem.tail + 'Node' ) );
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
            var cursorViewPosition = self.globalToLocalPoint( globalPoint );
            var massRectBounds = massNode.localToParentBounds( massNode.rect.bounds );
            var massHookBounds = massNode.localToParentBounds( massNode.hookNode.bounds );

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
    this.shelf = new Shelf( tandem, {
      rectHeight: 7
    } );
    this.shelf.rectY = this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) - this.shelf.rectHeight;

    this.addChild( this.shelf );


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
    this.timeControlNode = new TimeControlNode(
      model.playingProperty,
      new DynamicProperty( new Property( model.simSpeedProperty ), {
        map: function( simSpeed ) {
          return simSpeed === SimSpeedChoice.SLOW;
        },
        inverseMap: function( isSlow ) {
          return isSlow ? SimSpeedChoice.SLOW : SimSpeedChoice.NORMAL;
        },
        bidirectional: true
      } ), {
        stepCallback: function() { model.stepForward( 0.01 ); },
        tandem: tandem.createTandem( 'timeControlNode' )
      } );

    // @public
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

    // Buttons controlling the speed of the sim, play/pause button, and the reset button
    this.simControlHBox = new HBox( {
      spacing: this.spacing * 6,
      children: [ this.timeControlNode, this.resetAllButton ]
    } );
    this.addChild( this.simControlHBox );
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
     * @returns {SpringControlPanel}
     */
    createSpringConstantPanel: function( springIndex, labels, tandem ) {

      // Additional logic for compatibility with Masses and Springs: Basics
      var string = this.model.options.basicsVersion ? springStiffnessString : springConstantString;
      return new SpringControlPanel(
        this.model.springs[ springIndex ].springConstantProperty,
        MassesAndSpringsConstants.SPRING_CONSTANT_RANGE,
        StringUtils.fillIn( string, { spring: springIndex + 1, maxWidth: 40 } ),
        labels,
        tandem.createTandem( 'firstSpringConstantControlPanel' ),
        {
          top: this.spacing,
          visible: true,
          fill: 'white',
          stroke: 'gray',
          constrainValue: function( value ) {
            return Number( Util.toFixed( value, 0 ) );
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
     * @param {object} options
     * @return {IndicatorVisibilityControlNode}
     */
    createIndicatorVisibilityPanel: function( model, displayPeriodTrace, tandem, options ) {
      options = _.extend( {
        enableMovableLine: true
      }, options );
      return new IndicatorVisibilityControlNode(
        model,
        tandem.createTandem( 'indicatorVisibilityControlNode' ), {
          enableMovableLine: options.enableMovableLine,
          enablePeriodTrace: displayPeriodTrace
        } );
    },

    /**
     * Creates a panel that displays all of the right hand panels on the screen.
     * @public
     *
     * @param {Node} optionsContent
     * @param {AlignGroup} alignGroup
     * @param {Tandem } tandem
     * @return {Panel}
     */
    createOptionsPanel: function( optionsContent, alignGroup, tandem ) {
      var optionsContentAlignBox = new AlignBox( optionsContent, { group: alignGroup } );
      var optionsPanel = new Panel(
        optionsContentAlignBox, {
          xMargin: 10,
          fill: MassesAndSpringsConstants.PANEL_FILL,
          align: 'center',
          cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
          tandem: tandem.createTandem( 'LineVisibilityNode' ),
          minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 30
        } );
      optionsPanel.moveToBack();
      return optionsPanel;
    }
  } );
} );