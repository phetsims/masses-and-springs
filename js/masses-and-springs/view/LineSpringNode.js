// Copyright 2016, University of Colorado Boulder

/**
 *
 *
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Line = require( 'SCENERY/nodes/Line' );

  /**
   * @param {Spring} Spring model object
   * @param {ModelViewTransform} mvt
   * @constructor
   */
  function LineSpringNode( spring, mvt ) {
    var self = this;
    Node.call( this );

    this.spring = spring;
    var line = new Line( 0, 0, 0, mvt.modelToViewDeltaY( -spring.lengthProperty.get() ),
      { stroke: 'black', lineWidth: 10.5 }
    );
    this.addChild( line );

    spring.lengthProperty.link( function( length ) {
      line.setLine(   0, 0, 0, mvt.modelToViewDeltaY( -length )  );
    } );
    spring.positionProperty.link( function( position ) {
      self.translation = mvt.modelToViewPosition( position );
    } );
  }

  massesAndSprings.register( 'LineSpringNode', LineSpringNode );

  return inherit( Node, LineSpringNode );

} );
