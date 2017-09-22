// Copyright 2017, University of Colorado Boulder

/**
 * Responsible for the attributes associated with the reference line nodes.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Property = require( 'AXON/Property' );
  var TVector2 = require( 'DOT/TVector2' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LINE_LENGTH = 100;

  /**
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Spring}
   * @param {Property} property - determines which property is being referenced
   * @param {boolean} visibleProperty
   *
   * @constructor
   */
  function ReferenceLineNode( modelViewTransform2, spring, property, visibleProperty ) {
    var self = this;
    Line.call( this, 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(65,66,232)',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer'
    } );
    this.mouseArea = this.localBounds.dilatedY( 10 );
    this.touchArea = this.localBounds.dilatedY( 10 );

    // {read-write} prevents overlap with the equilibrium line
    var xPos = modelViewTransform2.modelToViewX( spring.positionProperty.get().x );

    // updates the position of the natural length line as the system changes
    property.link( function( value ) {

      // {read-write} Y position of line in screen coordinates
      var yPos = modelViewTransform2.modelToViewY( value );

      // @private {read-write} position of line in screen coordinates
      self.positionProperty = new Property( new Vector2( xPos, yPos ), {
          phetioValueType: TVector2
        } );

      // Link that handles the change in the lines position in screen coordinates
      self.positionProperty.link( function( position ) {
          self.translation = position.minus( new Vector2( LINE_LENGTH / 2, 0 ) );
        } );
    } );
    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'ReferenceLineNode', ReferenceLineNode );

  return inherit( Line, ReferenceLineNode, {

    /**
     * Resets the position of the line Node.
     *
     * @public
     */
    reset: function() {
      this.positionProperty.reset();
    }
  } );
} );