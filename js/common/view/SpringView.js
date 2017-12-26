// Copyright 2017, University of Colorado Boulder

/**
 * Common ScreenView used for both singular and multispring screen view.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var DraggableRulerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableRulerNode' );
  var DraggableTimerNode = require( 'MASSES_AND_SPRINGS/common/view/DraggableTimerNode' );
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/common/view/IndicatorVisibilityControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MassNode = require( 'MASSES_AND_SPRINGS/common/view/MassNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shelf = require( 'MASSES_AND_SPRINGS/common/view/Shelf' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var SpringControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringControlPanel' );
  var StopperButtonNode = require( 'MASSES_AND_SPRINGS/common/view/StopperButtonNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimeControlNode = require( 'MASSES_AND_SPRINGS/common/view/TimeControlNode' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var normalString = require( 'string!MASSES_AND_SPRINGS/normal' );
  var slowString = require( 'string!MASSES_AND_SPRINGS/slow' );
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );

  // constants
  var MAX_TEXT_WIDTH = 80;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function SpringView( model, tandem ) {
    var options = _.extend( {
      vectorViewEnabled: true
    }, options );

    this.model = model; // Make model available for reset
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );
    var self = this;

    this.modelViewTransform = MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( this.visibleBoundsProperty.get(), 0.98 );

    // @protected {Array.<OscillatingSpringNode>} Used to reference the created springs in the view.
    this.springNodes = [];
    model.springs.forEach( function( spring ) {
      var springNode = new OscillatingSpringNode(
        spring,
        MassesAndSpringsConstants.MODEL_VIEW_TRANSFORM( self.visibleBoundsProperty.get(), 1 ),
        tandem.createTandem( 'firstOscillatingSpringNode' )
      );
      self.addChild( springNode );
      self.springNodes.push( springNode );
    } );

    // Spacing used for the margin of layout bounds
    this.spacing = this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.CEILING_Y );

    // Alignment for panels on most right side of sim view
    this.rightPanelAlignment = this.visibleBoundsProperty.get().right - this.spacing;

    // Add masses
    this.massLayer = new Node( { tandem: tandem.createTandem( 'massLayer' ) } );
    this.massNodes = [];

    model.masses.forEach( function( mass ) {
      var massNode = new MassNode(
        mass,
        self.modelViewTransform,
        self.visibleBoundsProperty,
        model,
        tandem.createTandem( mass.massTandem.tail + 'Node' ), {
          vectorViewEnabled: options.vectorViewEnabled
        } );
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

    // Control Panel for display elements with varying visibility
    this.indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ), {
        top: this.spacing,
        right: this.rightPanelAlignment,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH
      }
    );

    // Timer and Ruler
    this.timerNode = new DraggableTimerNode(
      this.visibleBoundsProperty.get(),
      new Vector2( 0, 0 ),
      model.timerSecondsProperty,
      model.timerRunningProperty,
      model.timerVisibleProperty,
      tandem.createTandem( 'timerNode' )
    );
    this.rulerNode = new DraggableRulerNode(
      this.modelViewTransform,
      this.visibleBoundsProperty.get(),
      new Vector2( 0, 0 ),
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

    // Play/Pause and Step Forward Button Control
    this.timeControlPanel = new TimeControlNode(
      model,
      this.visibleBoundsProperty.get(),
      tandem.createTandem( 'timeControlPanel' ), {
        bottom: this.modelViewTransform.modelToViewY( MassesAndSpringsConstants.FLOOR_Y + 0.02 )
      }
    );

    // Sim speed controls
    var speedSelectionButtonOptions = {
      font: new PhetFont( 14 ),
      maxWidth: MAX_TEXT_WIDTH
    };
    var speedSelectionButtonRadius = 8;
    var normalText = new Text( normalString, speedSelectionButtonOptions, { tandem: tandem.createTandem( 'normalString' ) } );
    this.normalRadioBox = new AquaRadioButton( model.simSpeedProperty, 'normal', normalText, {
      radius: speedSelectionButtonRadius,
      tandem: tandem.createTandem( 'normalRadioBox' )
    } );

    var slowText = new Text( slowString, speedSelectionButtonOptions, { tandem: tandem.createTandem( 'slowText' ) } );
    this.slowRadioBox = new AquaRadioButton( model.simSpeedProperty, 'slow', slowText, {
      radius: speedSelectionButtonRadius,
      tandem: tandem.createTandem( 'slowRadioBox' )
    } );

    var radioButtonSpacing = 4;
    this.speedControl = new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [ this.normalRadioBox, this.slowRadioBox ],
      right: this.resetAllButton.left - 30,
      centerY: this.resetAllButton.centerY,
      tandem: tandem.createTandem( 'speedControl' )
    } );

    // sound toggle button at bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty, {
      centerY: this.resetAllButton.centerY - 55
    } );
    soundToggleButton.scale( .9 );
    this.addChild( soundToggleButton );

    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //Update the bounds of view elements
      soundToggleButton.right = visibleBounds.right - self.spacing;
    } );
  }

  massesAndSprings.register( 'SpringView', SpringView );

  return inherit( ScreenView, SpringView, {

    /**
     * Helper function to restore initial layering of the masses to prevent them from stacking over each other.
     *
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
     * @param {Number} springIndex
     * @param {Tandem} tandem
     * @returns {*}
     */
    createSpringConstantPanel: function( springIndex, tandem ) {
      return new SpringControlPanel(
        this.model.springs[ springIndex ].springConstantProperty,
        new RangeWithValue( 5, 15, 9 ),
        StringUtils.fillIn( springConstantString, { spring: springIndex + 1 } ),
        tandem.createTandem( 'firstSpringConstantControlPanel' ),
        {
          top: this.spacing,
          maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH - 30,
          visible: true,
          fill: 'white',
          stroke: 'gray'
        }
      )
        ;
    }
  } );
} );
