// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node for the Natural line.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var TVector2 = require( 'DOT/TVector2' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var LINE_LENGTH = 100;

  /**
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {Spring} spring - determines which spring is being referenced
   * @param {boolean} visibleProperty
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function NaturalLengthLineNode( modelViewTransform2, spring, visibleProperty, tandem ) {
    var self = this;
    Node.call( this );

    var line = new Line( 0, 0, LINE_LENGTH, 0, {
      stroke: 'rgb(65,66,232)',
      lineDash: [ 12, 8 ],
      lineWidth: 1.5,
      cursor: 'pointer',
      tandem: tandem.createTandem( 'line' )
    } );
    line.mouseArea = line.localBounds.dilated( 10 );
    line.touchArea = line.localBounds.dilated( 10 );

    this.addChild( line );

    // @private
    var xPos = modelViewTransform2.modelToViewX( spring.positionProperty.get().x ) + 7.5; // prevents overlap with the equilibrium line

    // updates the position of the natural length line as the system changes
    spring.bottomProperty.link( function( bottom ) {
      var yPos = modelViewTransform2.modelToViewY( bottom );

      self.positionProperty = new Property( new Vector2( xPos, yPos ), {
      tandem: tandem.createTandem( 'positionProperty' ),
      phetioValueType: TVector2
    } );
      self.positionProperty.link( function( position ) {
      self.translation = position.minus( new Vector2( LINE_LENGTH / 2, 0 ) );
      } );
    } );

    visibleProperty.linkAttribute( self, 'visible' );
  }

  massesAndSprings.register( 'NaturalLengthLineNode', NaturalLengthLineNode );

  return inherit( Node, NaturalLengthLineNode, {
    reset: function() {
      this.positionProperty.reset();
    }
  } );

} );