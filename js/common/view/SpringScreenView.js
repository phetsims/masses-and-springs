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
  var DraggableRulerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableRulerNode' );
  var DraggableTimerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableTimerNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IndicatorVisibilityControlNode = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlNode' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var Panel = require( 'SUN/Panel' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shelf = require( 'MASSES_AND_SPRINGS/common/view/Shelf' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/StopperButtonNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TimeControlHBox = require( 'MASSES_AND_SPRINGS/common/view/TimeControlHBox' );
  var ToolboxPanel = require( 'MASSES_AND_SPRINGS/common/view/ToolboxPanel' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function SpringScreenView( model, tandem ) {
    ScreenView.call( this );
    var self = this;

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

    // @protected {number} - Padding for panels on most right side of sim view
    this.rightPanelPadding = this.visibleBoundsProperty.get().right - this.spacing;

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

      // Keeps track of the mass node to restore original Z order.
      return massNode;
    } );

    // @public {Shelf} Add shelf for to house massNodes
    this.shelf = new Shelf( tandem, {
      rectHeight: 7
    } );
    this.shelf.rectY = this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) - this.shelf.rectHeight;

    this.addChild( this.shelf );

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
      right: this.visibleBoundsProperty.get().right - 10,
      bottom: this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ),
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // @public {TimeControlHBox} Sim speed controls
    this.timeControlPanel = new TimeControlHBox(
      model,
      tandem.createTandem( 'timeControlPanel' ), {
        bottom: this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y + MassesAndSpringsConstants.SHELF_HEIGHT )
      }
    );

    // @public {ToolboxPanel} Toolbox Panel
    this.toolboxPanel = new ToolboxPanel(
      this.visibleBoundsProperty.get(),
      this.rulerNode, this.timerNode,
      model.rulerVisibleProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 30,
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 20
      }
    );

    // Adding tools in toolbox
    this.addChild( this.toolboxPanel );

    //REVIEW: It seems like there are listeners similar to this on subtypes. It's better to create a layout() method
    //REVIEW: on the screenview and override/extend as necessary, as you are unintentionally depending on this listener
    //REVIEW: being added before the other visibleBoundsProperty listeners are added (for layout)
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      // Update the bounds of view elements
      self.panelRightSpacing = visibleBounds.right - self.spacing;
    } );
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
      return new SpringControlPanel(
        this.model.springs[ springIndex ].springConstantProperty,
        MassesAndSpringsConstants.SPRING_CONSTANT_RANGE,
        StringUtils.fillIn( springConstantString, { spring: springIndex + 1 } ),
        labels,
        tandem.createTandem( 'firstSpringConstantControlPanel' ),
        {
          top: this.spacing,
          maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30,
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
     * @param model {MassesAndSpringsModel} model
     * @param displayPeriodTrace {Boolean}
     * @param {Tandem} tandem
     * @return {IndicatorVisibilityControlNode}
     */
    createIndicatorVisibilityPanel: function( model, displayPeriodTrace, tandem ) {
      return new IndicatorVisibilityControlNode(
        model,
        tandem.createTandem( 'indicatorVisibilityControlNode' ), {
          maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
          xMargin: 0,
          yMargin: 0,
          stroke: null,
          periodTraceOption: displayPeriodTrace
        } );
    },

    /**
     * Creates a panel that displays all of the right hand panels on the screen.
     * @public
     *
     * @param optionsContent
     * @param tandem
     * @return {Panel}
     */
    createOptionsPanel: function( optionsContent, tandem ) {
      var optionsPanel = new Panel(
        optionsContent, {
          xMargin: 10,
          fill: MassesAndSpringsConstants.PANEL_FILL,
          cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
          tandem: tandem.createTandem( 'LineVisibilityNode' ),
          minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH + 5
        } );
      optionsPanel.moveToBack();
      return optionsPanel;
    }
  } );
} );
