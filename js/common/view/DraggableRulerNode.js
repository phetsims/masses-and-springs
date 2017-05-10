// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the attributes and drag handlers associated with the ruler node.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Matt Pennington (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RulerNode = require( 'SCENERY_PHET/RulerNode' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Property = require( 'AXON/Property' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var TVector2 = require( 'DOT/TVector2' );

  // strings
  var cmString = require( 'string!MASSES_AND_SPRINGS/cm' );

  /**
   * @param {Bounds2} dragBounds
   * @param {Vector2} initialPosition
   * @param {Property.<boolean>} visibleProperty
   * @param {Tandem} tandem
   *
   * @constructor
   */

  function DraggableRulerNode( dragBounds, initialPosition, visibleProperty, tandem ) {
    var self = this;

    // @public {read-write} Used for returning ruler to toolbox. Set this if needed to be returned.
    this.toolbox = null;

    // define ruler params in pixels
    var rulerWidth = 397; // 1 meter
    var rulerLength = .1 * rulerWidth;
    var majorTickLabels = [ '' ];
    for ( var i = 1; i < 10; i++ ) {
      majorTickLabels.push( '' );
      majorTickLabels.push( '' + Math.floor( i * 10 ) );
      assert && assert( majorTickLabels[ i * 2 ] === '' + Math.floor( i * 10 ) );
    }
    majorTickLabels.push( '' );
    majorTickLabels.push( '' );
    var majorTickWidth = rulerWidth / ( majorTickLabels.length - 1 );

    RulerNode.call( this, rulerWidth, rulerLength, majorTickWidth, majorTickLabels, cmString, {
      insetsWidth: 5,
      minorTicksPerMajorTick: 4,
      unitsMajorTickIndex: 19,
      rotation: Math.PI / 2,
      backgroundFill: 'rgb( 237, 225, 121 )',
      cursor: 'pointer',
      majorTickFont: MassesAndSpringsConstants.FONT,
      majorTickHeight: 10,
      minorTickHeight: 5,
      unitsFont: MassesAndSpringsConstants.FONT,
      opacity: .8,
      tickMarksOnBottom: false
    }, { tandem: tandem.createTandem( 'ruler' ) } );

    // @private {read-only} position of ruler node in screen coordinates
    this.positionProperty = new Property( initialPosition, {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );
    this.positionProperty.linkAttribute( this, 'translation' );

    // @private {read-only} handles ruler node drag events
    this.rulerNodeMovableDragHandler = new MovableDragHandler( this.positionProperty, {
      tandem: tandem.createTandem( 'dragHandler' ),
      dragBounds: dragBounds,
      endDrag: function() {

        // When a node is released, check if it is over the toolbox.  If so, drop it in.
        if ( self.toolbox && self.getGlobalBounds().intersectsBounds( self.toolbox.getGlobalBounds() ) ) {
          visibleProperty.set( false );
        }
      }
    } );
    this.addInputListener( this.rulerNodeMovableDragHandler );
    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'DraggableRulerNode', DraggableRulerNode );

  return inherit( RulerNode, DraggableRulerNode, {
    /**
     * @override
     *
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );