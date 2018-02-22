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
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shelf = require( 'MASSES_AND_SPRINGS/common/view/Shelf' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/StopperButtonNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TimeControlNode = require( 'MASSES_AND_SPRINGS/common/view/TimeControlNode' );
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

    var viewOrigin = new Vector2( 0, this.visibleBoundsProperty.get().height * 0.98 );

    // @public {ModelViewTransform2}
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( Vector2.ZERO, viewOrigin, 397 );

    // @protected {Array.<OscillatingSpringNode>} Used to reference the created springs in the view.
    this.springNodes = [];
    model.springs.forEach( function( spring ) {
      var springNode = new OscillatingSpringNode(
        spring,
        self.modelViewTransform,
        tandem.createTandem( 'firstOscillatingSpringNode' ), {
          leftEndLength: -10
        }
      );
      self.addChild( springNode );
      self.springNodes.push( springNode );
    } );

    // @protected {number} - Spacing used for the margin of layout bounds
    this.spacing = 10;

    // @protected {number} - Alignment for panels on most right side of sim view
    this.rightPanelAlignment = this.visibleBoundsProperty.get().right - this.spacing;

    // Add masses
    this.massLayer = new Node( { tandem: tandem.createTandem( 'massLayer' ), preventFit: true } );
    this.massNodes = [];

    model.masses.forEach( function( mass ) {
      var massNode = new MassNode(
        mass,
        self.modelViewTransform,
        self.visibleBoundsProperty,
        model,
        tandem.createTandem( mass.massTandem.tail + 'Node' ) );
      self.massLayer.addChild( massNode );

      // Keeps track of the mass node to restore original Z order.
      self.massNodes.push( massNode );
    } );

    // Add shelf for to house massNodes
    this.shelf = new Shelf( tandem, {
      rectHeight: 7
    } );
    this.shelf.rectY = this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y ) - this.shelf.rectHeight;

    this.addChild( this.shelf );

    // Timer and Ruler
    this.timerNode = new DraggableTimerNode(
      this.visibleBoundsProperty.get(),
      Vector2.ZERO,
      model.timerSecondsProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'timerNode' )
    );
    this.rulerNode = new DraggableRulerNode(
      this.modelViewTransform,
      this.visibleBoundsProperty.get(),
      Vector2.ZERO,
      model.rulerVisibleProperty,
      tandem.createTandem( 'rulerNode' )
    );

    // Reset All button
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

    // Sim speed controls
    this.timeControlPanel = new TimeControlNode(
      model,
      this.visibleBoundsProperty.get(),
      tandem.createTandem( 'timeControlPanel' ), {
        bottom: this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y + 0.02 ),
      }
    );

    // sound toggle button at bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty, {
      centerY: this.resetAllButton.centerY - 55,
      scale: 0.9
    } );
    // this.addChild( soundToggleButton );

    // Toolbox Panel
    this.toolboxPanel = new ToolboxPanel(
      this.visibleBoundsProperty.get(),
      this.rulerNode, this.timerNode,
      model.rulerVisibleProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'toolboxPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 30,
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH + 20,
      }
    );

    // Adding tools in toolbox
    this.addChild( this.toolboxPanel );
    this.addChild( this.timerNode );
    this.addChild( this.rulerNode );
    this.timerNode.toolbox = this.toolboxPanel;
    this.rulerNode.toolbox = this.toolboxPanel;

    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //Update the bounds of view elements
      self.panelRightSpacing = visibleBounds.right - self.spacing;
      soundToggleButton.right = self.panelRightSpacing;
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
     *
     * @param {number} springIndex
     * @param {array.<Text>} labels
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
    }
  } );
} );
