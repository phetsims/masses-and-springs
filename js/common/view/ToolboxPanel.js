// Copyright 2016, University of Colorado Boulder

/**
 * Responsible for the toolbox panel and the ruler/timer icons held within
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Range = require( 'DOT/Range' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Timer = require( 'SCENERY_PHET/Timer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Bounds2} dragBounds
   * @param {DraggableRulerNode} rulerNode
   * @param {DraggableTimerNode} timerNode
   * @param {Property.<boolean>} rulerVisibleProperty
   * @param {Property.<boolean>} timerVisibleProperty
   * @param {Tandem} tandem
   * @param {Options} options
   * @constructor
   */
  function ToolboxPanel( dragBounds, rulerNode, timerNode, rulerVisibleProperty, timerVisibleProperty, tandem, options ) {
    options = _.extend( {
      dragBounds: dragBounds,
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    }, options );

    var self = this;
    var toolbox = new HBox( {
      align: 'center',
      spacing: 30,
      tandem: tandem.createTandem( 'toolbox' )
    } );
    Panel.call( this, toolbox, options );

    // Create timer to be turned into icon
    var secondsProperty = new Property( 0, {
      tandem: tandem.createTandem( 'secondsProperty' ),
      phetioValueType: TNumber( {
        units: 'seconds',
        range: new Range( 0, Number.POSITIVE_INFINITY )
      } )
    } );
    var isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' )
    } );
    var timer = new Timer( secondsProperty, isRunningProperty );

    // Create ruler to be turned into icon
    var rulerWidth = 397; // 1 meter
    var rulerLength = .175 * rulerWidth;
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) { // create 10 empty strings for labels
      majorTickLabels.push( '' );
    }
    var majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );
    var ruler = new RulerNode(
      rulerWidth,
      rulerLength,
      majorTickWidth,
      majorTickLabels,
      '',
      { tandem: tandem.createTandem( 'ruler' ) } );
    ruler.rotate( 40, false );

    // Create timer icon
    ruler.toImage( function( image ) {

      // @private - visible option is used only for reset() in ToolboxPanel.js
      self.rulerIcon = new Image( image, {
        cursor: 'pointer',
        pickable: true,
        scale: .1,
        tandem: tandem.createTandem( 'rulerIcon' )
      } );

      // Input listeners for the ruler icon
      var rulerUnboundedPosition = new Vector2();

      // Drag listener for event forwarding: rulerIcon ---> rulerNode
      self.rulerIcon.addInputListener( new TandemSimpleDragHandler( {

        // allow moving a finger (on a touchscreen) dragged across this node to interact with it
        allowTouchSnag: true,
        tandem: tandem.createTandem( 'dragHandler' ),

        start: function( event ) {
          // Toggle visibility
          rulerVisibleProperty.set( true );
          rulerVisibleProperty.link( function( visible ) {
            self.rulerIcon.visible = !visible;
          } );

          // Now determine the initial position where this element should move to after it's created, which corresponds
          // to the location of the mouse or touch event.
          var initialPosition = rulerNode.globalToParentPoint( event.pointer.point )
            .minus( new Vector2( -rulerNode.width * .5, rulerNode.height * .4 ) );
          rulerNode.positionProperty.set( initialPosition );
          rulerUnboundedPosition.set( initialPosition );

          // Sending through the startDrag from icon to rulerNode causes it to receive all subsequent drag events.
          //TODO: reference https://github.com/phetsims/masses-and-springs/issues/60
          rulerNode.startDrag( event );
        }
      } ) );
      toolbox.addChild( self.rulerIcon );
    } );

    // Create timer icon
    timer.toImage( function( image ) {

      // @private - visible option is used only for reset() in ToolboxPanel.js
      self.timerIcon = new Image( image, {
        cursor: 'pointer',
        pickable: true,
        scale: .4,
        tandem: tandem.createTandem( 'timerIcon' )
      } );

      var timerUnboundedPosition = new Vector2();

      // Drag listener for event forwarding: timerIcon ---> timerNode
      self.timerIcon.addInputListener( new TandemSimpleDragHandler( {

        // allow moving a finger (on a touchscreen) dragged across this node to interact with it
        allowTouchSnag: true,
        tandem: tandem.createTandem( 'dragHandler' ),

        start: function( event ) {
          // Toggle visibility
          timerVisibleProperty.set( true );
          timerVisibleProperty.link( function( visible ) {
            self.timerIcon.visible = !visible;
          } );

          // Now determine the initial position where this element should move to after it's created, which corresponds
          // to the location of the mouse or touch event.
          var initialPosition = timerNode.globalToParentPoint( event.pointer.point )
            .minus( new Vector2( timerNode.width / 2, timerNode.height * .4 ) );

          timerNode.positionProperty.set( initialPosition );
          timerUnboundedPosition.set( initialPosition );

          // Sending through the startDrag from icon to timerNode causes it to receive all subsequent drag events.
          //TODO: reference https://github.com/phetsims/masses-and-springs/issues/60
          timerNode.startDrag( event );
        }
      } ) );
      toolbox.addChild( self.timerIcon );
    } );
  }

  massesAndSprings.register( 'ToolboxPanel', ToolboxPanel );

  return inherit( Panel, ToolboxPanel );

} );
